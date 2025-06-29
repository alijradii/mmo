import { State } from "../genericStates/state";
import { Attack } from "../../modules/attackModule/attack";
import { Entity } from "../entity";
import { Player } from "../../player/player";

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

    if(this.entity instanceof Player) {
      this.entity.inputQueue.length = 0;
    }
  }
}
