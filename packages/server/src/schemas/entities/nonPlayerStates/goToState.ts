import { toTile } from "../modules/pathfinding/pathUtils";
import { Entity } from "../entity";
import { PathFindState } from "./pathFindState";

export class GoToState extends PathFindState {
  private destination: { x: number; y: number };
  private onDone: () => void;

  constructor(entity: Entity, destination: { x: number; y: number }, onDone: () => void, arriveRadius = 4) {
    super("go_to", entity, arriveRadius);
    this.destination = destination;
    this.onDone = onDone;
  }

  protected getTargetTile() {
    return toTile(this.destination.x, this.destination.y);
  }

  protected onArrive() {
    this.onDone?.();
    this.entity.setState(this.entity.idleState);
  }
}
