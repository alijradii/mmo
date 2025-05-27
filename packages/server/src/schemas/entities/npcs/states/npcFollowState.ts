import { Entity } from "../../entity";
import { State } from "../../genericStates/state";
import { computePathAsync } from "../../modules/pathfinding/pathfinding";
import { NPC } from "../npc";

function raycastClear(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  worldMap: number[][],
  tileSize = 16
): boolean {
  // Convert world-space points into tile coordinates
  let tx0 = Math.floor(x0 / tileSize);
  let ty0 = Math.floor(y0 / tileSize);
  const tx1 = Math.floor(x1 / tileSize);
  const ty1 = Math.floor(y1 / tileSize);

  const dx = Math.abs(tx1 - tx0);
  const dy = Math.abs(ty1 - ty0);
  const sx = tx0 < tx1 ? 1 : -1;
  const sy = ty0 < ty1 ? 1 : -1;

  let err = dx - dy;

  while (true) {
    // If this tile is not walkable, the ray is blocked
    if (
      ty0 < 0 ||
      ty0 >= worldMap.length ||
      tx0 < 0 ||
      tx0 >= worldMap[0].length ||
      worldMap[ty0][tx0] !== 1
    ) {
      return false;
    }

    // Reached the destination tile
    if (tx0 === tx1 && ty0 === ty1) {
      return true;
    }

    // Step
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      tx0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      ty0 += sy;
    }
  }
}

export class NPCFollowState extends State {
  target: Entity;
  private isThinking: boolean = false;
  private path: Array<{ x: number; y: number }> = [];
  private waypointIndex = 0;
  private lastTargetTile: { x: number; y: number } | null = null;
  private replanCooldown = 0;
  private lastPosition: { x: number; y: number } | null = null;
  private failedAttempts = 0;
  private stuckCounter = 0;

  constructor(entity: NPC, target: Entity) {
    super("follow", entity);

    this.target = target;
  }

  update() {
    const self = this.entity;

    if (!this.isThinking) {
      this.isThinking = true;
      this.think().finally(() => {
        this.isThinking = false;
      });
    }
    self.updatePhysics();
  }

  async think() {
    const self = this.entity;
    const tar = this.target;
    const tickInterval = 1;
    const tileSize = 16;

    this.failedAttempts ??= 0;
    this.lastPosition ??= { x: self.x, y: self.y };
    this.stuckCounter ??= 0;

    // Movement delta check
    const dx = self.x - this.lastPosition.x;
    const dy = self.y - this.lastPosition.y;
    const movedDistanceSq = dx * dx + dy * dy;

    if (movedDistanceSq < 0.5 * 0.5) {
      this.stuckCounter++;
    } else {
      this.stuckCounter = 0;
      this.failedAttempts = 0;
    }
    this.lastPosition = { x: self.x, y: self.y };

    const currentTile = {
      x: Math.floor(self.x / tileSize),
      y: Math.floor(self.y / tileSize),
    };
    const targetTile = {
      x: Math.floor(tar.x / tileSize),
      y: Math.floor(tar.y / tileSize),
    };

    const heightmap = self.world.mapInfo.heightmap;
    const isValidTile = (tile: { x: number; y: number }) =>
      heightmap[tile.y]?.[tile.x] !== undefined;

    const targetMoved =
      !this.lastTargetTile ||
      this.lastTargetTile.x !== targetTile.x ||
      this.lastTargetTile.y !== targetTile.y;

    this.replanCooldown -= tickInterval;
    const needReplan =
      this.path.length === 0 ||
      this.waypointIndex >= this.path.length ||
      (targetMoved && this.replanCooldown <= 0) ||
      this.stuckCounter > 10;

    // Only attempt to compute a new path if both tiles are valid
    if (needReplan && isValidTile(currentTile) && isValidTile(targetTile)) {
      const isGrounded =
        heightmap[currentTile.y][currentTile.x] === 1 &&
        heightmap[targetTile.y][targetTile.x] === 1;

      if (isGrounded) {
        const path = await computePathAsync(
          { x: self.x, y: self.y },
          { x: tar.x, y: tar.y },
          heightmap
        );

        if (path === null) {
          this.failedAttempts++;
          this.path = [];
          this.waypointIndex = 0;
          self.accelDir.x = 0;
          self.accelDir.y = 0;
          this.replanCooldown = 40;

          if (this.failedAttempts >= 10) {
            console.log("Failed too many times, going idle.");
            self.setState(self.idleState);
          } else {
            console.log("Path not found, will retry.");
          }

          return;
        }

        this.path = path;
        this.waypointIndex = 0;
        this.lastTargetTile = targetTile;
        this.replanCooldown = 0.5;
        this.stuckCounter = 0;

        // prune
        const pruned: typeof this.path = [];
        let i = 0;
        while (i < this.path.length) {
          let furthest = i;
          for (let j = this.path.length - 1; j > furthest; j--) {
            const p0 = {
              x: (this.path[i].x + 0.5) * tileSize,
              y: (this.path[i].y + 0.5) * tileSize,
            };
            const p1 = {
              x: (this.path[j].x + 0.5) * tileSize,
              y: (this.path[j].y + 0.5) * tileSize,
            };
            if (raycastClear(p0.x, p0.y, p1.x, p1.y, heightmap)) {
              furthest = j;
              break;
            }
          }
          pruned.push(this.path[furthest]);
          i = furthest + 1;
        }
        this.path = pruned;
      }
    }

    // Continue along existing path even if not grounded
    if (this.waypointIndex < this.path.length) {
      const tile = this.path[this.waypointIndex];
      const waypoint = {
        x: (tile.x + 0.5) * tileSize,
        y: (tile.y + 0.5) * tileSize,
      };
      const dx = waypoint.x - self.x;
      const dy = waypoint.y - self.y;
      const dist2 = dx * dx + dy * dy;

      const arriveRadius = 4;
      if (dist2 < arriveRadius * arriveRadius) {
        this.waypointIndex++;
      } else {
        const len = Math.sqrt(dist2);
        self.accelDir = { x: dx / len, y: dy / len, z: self.accelDir.z };
      }
    } else {
      self.accelDir = { x: 0, y: 0, z: self.accelDir.z };
      console.log("Target reached, going idle");
      self.setState(self.idleState);
    }
  }
}
