import { GameRoom } from "../../rooms/gameRoom";
import { Entity } from "../entities/entity";
import { type } from "@colyseus/schema";
import { PlayerInput } from "../playerInput";
import { IdleState } from "./states/playerIdleState";
import { State } from "../entities/genericStates/state";
import { AttackState } from "./states/playerAttackState";
import { Rectangle } from "../../utils/hitboxes";
import { Attack } from "../modules/attackModule/attack";
import { MeleeAttack } from "../modules/attackModule/meleeAttack";
import { IPlayer } from "../../database/models/player.model";
import { RangedAttack } from "../modules/attackModule/rangedAttack";
import { itemLoader } from "../../data/itemLoader";

export class Player extends Entity {
  @type("number")
  tick: number = 0;

  @type("string")
  username: string = "";

  @type("string")
  frontextra = "";

  @type("string")
  hair = "";

  @type("string")
  backhair = "";

  @type("string")
  head = "";

  @type("string")
  hat = "";

  @type("string")
  top = "";

  @type("string")
  bottom = "";

  @type("string")
  backextra = "";

  @type("string")
  weapon = "";

  colliderWidth = 18;
  colliderHeight = 26;

  hitBoxWidth: number = 32;
  hitBoxHeight: number = 32;

  public attackState: State;
  public inputQueue: PlayerInput[] = [];

  autoAttack: Attack = new Attack(this);

  constructor(world: GameRoom, playerDocument: IPlayer) {
    super(world);
    this.HP = 100;
    this.MAX_HP = 100;

    this.idleState = new IdleState(this);
    this.attackState = new AttackState(this);

    this.setState(this.idleState);

    this.initDocument(playerDocument);

    this.initAttack();
  }

  initAttack() {
    const weapon = itemLoader.weapons.get(this.weapon);
    if (!weapon) {
      this.autoAttack = new MeleeAttack(this);
      return;
    }
    
    console.log(weapon)

    if (weapon.type === "ranged") {
      this.autoAttack = new RangedAttack(this);
    }
    else {
      this.autoAttack = new MeleeAttack(this);
    }

    this.autoAttack.damage = weapon.damage;
    this.autoAttack.cooldown = weapon.cooldown;
    this.autoAttack.knockback = weapon.knockback;
    // this.autoAttack.duration
  }

  initDocument(playerDocument: IPlayer) {
    this.id = playerDocument._id;
    this.username = playerDocument.username;
    this.hat = playerDocument.gear.hat;
    this.frontextra = playerDocument.gear.frontextra;
    this.head = playerDocument.gear.head;
    this.hair = playerDocument.gear.hair;
    this.backhair = playerDocument.gear.backhair;
    this.top = playerDocument.gear.top;
    this.bottom = playerDocument.gear.bottom;
    this.weapon = playerDocument.gear.weapon;
  }

  update() {
    // if (!this.getState().entity) {
    //   this.getState().entity = this;
    // }
    // if (!this.autoAttack.entity) {
    //   this.autoAttack.entity = this;
    // }

    this.getState().update();
  }

  getHitBoxRect(): Rectangle {
    let xoffset = 0;
    let yoffset = 0;

    switch (this.direction) {
      case "up":
        [xoffset, yoffset] = [0, -11];
        break;
      case "down":
        [xoffset, yoffset] = [0, 6];
        break;
      case "left":
        [xoffset, yoffset] = [-6, 0];
        break;
      case "right":
        [xoffset, yoffset] = [11, 0];
    }

    return {
      x: this.x - this.hitBoxWidth / 2 + xoffset,
      y: this.y - this.hitBoxHeight / 2 + yoffset,
      width: this.hitBoxWidth,
      height: this.hitBoxHeight,
    };
  }

  clearInupt(): void {
    this.inputQueue.length = 0;
  }

  kill() {
    this.x = 0;
    this.y = 0;
    this.xVelocity = 0;
    this.yVelocity = 0;

    this.HP = this.MAX_HP;

    console.log(this.username, " was killed!!!");
  }
}
