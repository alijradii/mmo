import { Action } from "../core/action";
import { Entity } from "../../entities/entity";
import {
  toTile,
  hasTargetMoved,
  isValidTile,
  isGrounded,
  shouldReplan,
  prunePath,
} from "../../entities/modules/pathfinding/pathUtils";
import { computePathAsync } from "../../entities/modules/pathfinding/pathfinding";
import { getManhattanDistance } from "../../../utils/math/helpers";

export class GoToAction extends Action {
  private path: Array<{ x: number; y: number }> = [];
  private waypointIndex = 0;
  private lastTargetTile: { x: number; y: number } | null = null;
  private lastPosition: { x: number; y: number } | null = null;
  private stuckCounter = 0;
  private failedAttempts = 0;
  private replanCooldownTicks = 0; // replaces time-based cooldown
  private isThinking = false;
  private arriveRadius: number;

  constructor(
    public entity: Entity,
    public targetTile: { x: number; y: number },
    arriveRadius = 4
  ) {
    const preconditions = {};
    const effects = {
      [`at_${targetTile.x}_${targetTile.y}`]: true,
    };

    super("go_to", 10, preconditions, effects, entity);

    this.state = "move";
    this.arriveRadius = arriveRadius;
  }

  override start() {
    this.path = [];
    this.failedAttempts = 0;
    this.replanCooldownTicks = 0;
    this.waypointIndex = 0;
    this.lastTargetTile = null;
    this.stuckCounter = 0;
    this.lastPosition = null;
  }

  override async perform() {
    const self = this.entity;
    const tileSize = 16;
    const heightmap = self.world.mapInfo.heightmap;

    const dx = self.x - (this.lastPosition?.x ?? 0);
    const dy = self.y - (this.lastPosition?.y ?? 0);
    const movedDistSq = dx * dx + dy * dy;
    this.lastPosition = { x: self.x, y: self.y };

    const distToTarget = getManhattanDistance({
      ax: self.x,
      ay: self.y,
      bx: this.targetTile.x * tileSize,
      by: this.targetTile.y * tileSize,
    });
    if (distToTarget < this.arriveRadius) {
      self.accelDir = { x: 0, y: 0, z: self.accelDir.z };
      self.xVelocity = 0;
      self.yVelocity = 0;
      this.finished = true;
      return;
    }

    if (movedDistSq < 0.25) this.stuckCounter++;
    else this.stuckCounter = 0;

    const currentTile = toTile(self.x, self.y, tileSize);
    const targetMoved = hasTargetMoved(this.targetTile, this.lastTargetTile);

    this.replanCooldownTicks = Math.max(0, this.replanCooldownTicks - 1);

    if (
      shouldReplan(
        this.path.length,
        this.waypointIndex,
        targetMoved,
        this.replanCooldownTicks,
        this.stuckCounter
      ) &&
      isValidTile(currentTile, heightmap) &&
      isValidTile(this.targetTile, heightmap) &&
      isGrounded(currentTile, this.targetTile, heightmap)
    ) {
      const path = await computePathAsync(
        { x: self.x, y: self.y },
        {
          x: this.targetTile.x * tileSize + tileSize / 2,
          y: this.targetTile.y * tileSize + tileSize / 2,
        },
        heightmap
      );

      if (path === null) {
        this.failedAttempts++;
        this.path = [];
        this.waypointIndex = 0;
        self.accelDir.x = 0;
        self.accelDir.y = 0;
        this.replanCooldownTicks = 40;

        if (this.failedAttempts >= 10) {
          this.failed = true;
        }
        return;
      }

      this.path = prunePath(path, tileSize, heightmap);
      this.waypointIndex = 0;
      this.lastTargetTile = this.targetTile;
      this.replanCooldownTicks = 10;
      this.stuckCounter = 0;
    }

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
    }
  }
}
