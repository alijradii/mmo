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

export abstract class PathFindAction extends Action {
  protected path: Array<{ x: number; y: number }> = [];
  protected waypointIndex = 0;
  protected lastTargetTile: { x: number; y: number } | null = null;
  protected lastPosition: { x: number; y: number } | null = null;
  protected stuckCounter = 0;
  protected failedAttempts = 0;
  protected replanCooldownTicks = 0;
  protected arriveRadius: number;
  protected tileSize = 16;

  constructor(
    name: string,
    cost: number,
    preconditions: Record<string, any>,
    effects: Record<string, any>,
    entity: Entity,
    arriveRadius: number
  ) {
    super(name, cost, preconditions, effects, entity);
    this.arriveRadius = arriveRadius;
    this.state = "move";
    this.entity = entity;
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

    if (!self || self.state === "jump") return;

    const heightmap = self.world.mapInfo.heightmap;

    // movement and stuck detection
    const dx = self.x - (this.lastPosition?.x ?? 0);
    const dy = self.y - (this.lastPosition?.y ?? 0);
    const movedDistSq = dx * dx + dy * dy;
    this.lastPosition = { x: self.x, y: self.y };

    const targetCoord = this.getTargetCoord();
    const targetTile = toTile(targetCoord.x, targetCoord.y, this.tileSize);

    // arrival check
    const distToTarget = getManhattanDistance({
      ax: self.x,
      ay: self.y,
      bx: targetCoord.x,
      by: targetCoord.y,
    });
    if (distToTarget < this.arriveRadius) {
      this.stopEntityMotion(self);
      this.onArrive();
      return;
    }

    // stuck counter
    if (movedDistSq < 0.25) this.stuckCounter++;
    else this.stuckCounter = 0;

    const currentTile = toTile(self.x, self.y, this.tileSize);
    const targetMoved = hasTargetMoved(targetTile, this.lastTargetTile);
    this.replanCooldownTicks = Math.max(0, this.replanCooldownTicks - 1);

    // replanning
    if (
      shouldReplan(
        this.path.length,
        this.waypointIndex,
        targetMoved,
        this.replanCooldownTicks,
        this.stuckCounter
      ) &&
      isValidTile(currentTile, heightmap) &&
      isValidTile(targetTile, heightmap) &&
      isGrounded(currentTile, targetTile, heightmap)
    ) {
      const path = await computePathAsync(
        { x: self.x, y: self.y },
        { x: targetCoord.x, y: targetCoord.y },
        heightmap
      );

      if (path === null) {
        this.handlePathFail(self);
        return;
      }

      this.path = prunePath(path, this.tileSize, heightmap);
      this.waypointIndex = 0;
      this.lastTargetTile = targetTile;
      this.replanCooldownTicks = 10;
      this.stuckCounter = 0;
    }

    // follow path
    if (this.waypointIndex < this.path.length) {
      this.moveAlongPath(self);
    } else {
      this.stopEntityMotion(self);
    }
  }

  protected stopEntityMotion(self: Entity) {
    self.accelDir = { x: 0, y: 0, z: self.accelDir.z };
    self.xVelocity = 0;
    self.yVelocity = 0;
    this.finished = true;
  }

  protected handlePathFail(self: Entity) {
    this.failedAttempts++;
    this.path = [];
    this.waypointIndex = 0;
    this.stopEntityMotion(self);
    this.replanCooldownTicks = 40;
    if (this.failedAttempts >= 10) {
      this.failed = true;
    }
  }

  protected moveAlongPath(self: Entity) {
    const tile = this.path[this.waypointIndex];
    const waypoint = {
      x: (tile.x + 0.5) * this.tileSize,
      y: (tile.y + 0.5) * this.tileSize,
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
  }

  protected abstract getTargetCoord(): { x: number; y: number };
  protected abstract onArrive(): void;
}
