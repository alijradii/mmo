import { State } from "../../entities/genericStates/state";
import { Attack } from "../../modules/attackModule/attack";
import { Entity } from "../entity";

export class AttackState extends State {
  declare entity: Entity;
  attack: Attack;
  duration = 0;

  constructor(entity: Entity, attack: Attack) {
    super("attack", entity);
    this.entity = entity;
    this.attack = attack;
  }
  
  isValid(){
    return this.attack.isReady();
  }

  onEnter() {
    this.duration = 14;
    this.entity.tick = this.entity.world.state.tick;

    if(!this.attack.isReady()) {
      console.log("error, trying to attack while not ready.")
    }
  }

  update(): void {
    if (this.duration === 10) {
      this.attack.execute();
    }

    if (this.duration <= 0) this.entity.setState(this.entity.idleState);
    this.duration--;
  }
}
