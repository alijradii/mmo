import { Attack } from "../../modules/attackModule/attack";
import { Entity } from "../entity";
import { AttackState } from "./attackState";
import { ChaseState } from "./chaseState";

export class ChaseAttackState extends ChaseState {
  attack: Attack;

  constructor(
    entity: Entity,
    target: Entity,
    attack: Attack,
    arriveRadius: number = 100
  ) {
    super(entity, target, arriveRadius);
    this.attack = attack;

    console.log("created new chase state with radius: ", this.arriveRadius);
  }

  onCaught() {
    this.entity.deltaX = -this.entity.x + this.target.x;
    this.entity.deltaY = -this.entity.y + this.target.y;

    // this.entity.direction = getDirectionFromVector({
    //   x: this.entity.deltaX,
    //   y: this.entity.deltaY,
    // });

    console.log("attacking: ", this.entity.deltaX, this.entity.deltaY);

    this.entity.setState(new AttackState(this.entity, this.attack));
  }
}
