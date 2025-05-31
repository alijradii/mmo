import { getManhattanDistance } from "../../../utils/math/helpers";
import { Entity } from "../entity";
import { State } from "../genericStates/state";
import { computePathAsync } from "../modules/pathfinding/pathfinding";
import {
  toTile,
  hasTargetMoved,
  isValidTile,
  isGrounded,
  shouldReplan,
  prunePath,
} from "../modules/pathfinding/pathUtils";

export abstract class PathFindState extends State {
  protected path: Array<{ x: number; y: number }> = [];
  protected waypointIndex = 0;
  protected lastTargetTile: { x: number; y: number } | null = null;
  protected replanCooldown = 0;
  protected lastPosition: { x: number; y: number } | null = null;
  protected failedAttempts = 0;
  protected stuckCounter = 0;
  protected arriveRadius: number;
  protected isThinking = false;

  constructor(stateName: string, entity: Entity, arriveRadius = 4) {
    super(stateName, entity);
    this.arriveRadius = arriveRadius;
  }

  update() {
    if (!this.isThinking) {
      this.isThinking = true;
      this.think().finally(() => (this.isThinking = false));
    }
    this.entity.updatePhysics();
  }

  protected abstract getTargetTile(): { x: number; y: number } | null;
  protected abstract onArrive(): void;

  protected async think() {
    const self = this.entity;
    const tickInterval = 1;
    const tileSize = 16;
    const heightmap = self.world.mapInfo.heightmap;

    // Stuck detection
    const dx = self.x - (this.lastPosition?.x ?? 0);
    const dy = self.y - (this.lastPosition?.y ?? 0);
    const movedDistSq = dx * dx + dy * dy;

    if (
      this.lastTargetTile &&
      getManhattanDistance({
        ax: this.entity.x,
        ay: this.entity.y,
        bx: this.lastTargetTile.x * 16,
        by: this.lastTargetTile.y * 16,
      }) <
        this.arriveRadius
    ) {
      const distance = getManhattanDistance({
        ax: this.entity.x,
        ay: this.entity.y,
        bx: this.lastTargetTile.x * 16,
        by: this.lastTargetTile.y * 16,
      });

      console.log("distance: ", distance, ", radius: ", this.arriveRadius)

      this.onArrive();
    }

    if (movedDistSq < 0.25) this.stuckCounter++;
    else {
      this.stuckCounter = 0;
      this.failedAttempts = 0;
    }
    this.lastPosition = { x: self.x, y: self.y };

    const currentTile = toTile(self.x, self.y, tileSize);
    const targetTile = this.getTargetTile();
    if (!targetTile) return;

    const targetMoved = hasTargetMoved(targetTile, this.lastTargetTile);
    this.replanCooldown -= tickInterval;

    if (
      shouldReplan(
        this.path.length,
        this.waypointIndex,
        targetMoved,
        this.replanCooldown,
        this.stuckCounter
      ) &&
      isValidTile(currentTile, heightmap) &&
      isValidTile(targetTile, heightmap) &&
      isGrounded(currentTile, targetTile, heightmap)
    ) {
      const path = await computePathAsync(
        { x: self.x, y: self.y },
        {
          x: targetTile.x * tileSize + tileSize / 2,
          y: targetTile.y * tileSize + tileSize / 2,
        },
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
        }
        return;
      }

      this.path = prunePath(path, tileSize, heightmap);
      this.waypointIndex = 0;
      this.lastTargetTile = targetTile;
      this.replanCooldown = 0.5;
      this.stuckCounter = 0;
    }

    // Follow path
    if (this.waypointIndex < this.path.length) {
      const tile = this.path[this.waypointIndex];
      const waypoint = {
        x: (tile.x + 0.5) * tileSize,
        y: (tile.y + 0.5) * tileSize,
      };
      const dx = waypoint.x - self.x;
      const dy = waypoint.y - self.y;
      const dist2 = dx * dx + dy * dy;

      if (dist2 < 16) {
        this.waypointIndex++;
      } else {
        const len = Math.sqrt(dist2);
        self.accelDir = { x: dx / len, y: dy / len, z: self.accelDir.z };
      }
    } else {
      self.accelDir = { x: 0, y: 0, z: self.accelDir.z };
      self.xVelocity = 0;
      self.yVelocity = 0;
      this.onArrive();
    }
  }
}
