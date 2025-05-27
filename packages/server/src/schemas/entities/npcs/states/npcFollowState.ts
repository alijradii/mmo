import { Entity } from "../../entity";
import { State } from "../../genericStates/state";
import { computePathAsync } from "../../modules/pathfinding/pathfinding";
import { NPC } from "../npc";
import {
  toTile,
  hasTargetMoved,
  isValidTile,
  isGrounded,
  shouldReplan,
  prunePath,
} from "../../modules/pathfinding/pathUtils";

export class NPCFollowState extends State {
  target: Entity;
  private arriveRadius: number = 4;
  private isThinking: boolean = false;
  private path: Array<{ x: number; y: number }> = [];
  private waypointIndex = 0;
  private lastTargetTile: { x: number; y: number } | null = null;
  private replanCooldown = 0;
  private lastPosition: { x: number; y: number } | null = null;
  private failedAttempts = 0;
  private stuckCounter = 0;

  constructor(entity: NPC, target: Entity, arriveRadius?: number) {
    super("follow", entity);

    this.target = target;

    if(arriveRadius)
      this.arriveRadius = arriveRadius;
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
    const heightmap = self.world.mapInfo.heightmap;

    // Track movement to detect stuck condition
    const dx = self.x - (this.lastPosition?.x || 0);
    const dy = self.y - (this.lastPosition?.y || 0);
    const movedDistanceSq = dx * dx + dy * dy;

    if (movedDistanceSq < 0.25) {
      this.stuckCounter++;
    } else {
      this.stuckCounter = 0;
      this.failedAttempts = 0;
    }
    this.lastPosition = { x: self.x, y: self.y };

    const currentTile = toTile(self.x, self.y, tileSize);
    const targetTile = toTile(tar.x, tar.y, tileSize);
    const targetMoved = hasTargetMoved(targetTile, this.lastTargetTile);

    this.replanCooldown -= tickInterval;
    const needReplan = shouldReplan(
      this.path.length,
      this.waypointIndex,
      targetMoved,
      this.replanCooldown,
      this.stuckCounter
    );

    // replan if needed
    if (
      needReplan &&
      isValidTile(currentTile, heightmap) &&
      isValidTile(targetTile, heightmap)
    ) {
      if (isGrounded(currentTile, targetTile, heightmap)) {
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

        this.path = prunePath(path, tileSize, heightmap);
        this.waypointIndex = 0;
        this.lastTargetTile = targetTile;
        this.replanCooldown = 0.5;
        this.stuckCounter = 0;
      }
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

      if (dist2 < this.arriveRadius * this.arriveRadius) {
        this.waypointIndex++;
      } else {
        const len = Math.sqrt(dist2);
        self.accelDir = { x: dx / len, y: dy / len, z: self.accelDir.z };
      }
    } else {
      self.accelDir = { x: 0, y: 0, z: self.accelDir.z };
      self.xVelocity = 0;
      self.yVelocity = 0;
      console.log("Target reached, going idle");
      self.setState(self.idleState);
    }
  }
}
