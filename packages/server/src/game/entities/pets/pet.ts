import petModel, { IPet } from "../../../database/models/pet.model";
import { IWeapon } from "../../../database/models/weapon.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { PetGoapAgent } from "../../goap/agents/petGoapAgent";
import { GoapAgent } from "../../goap/core/goapAgent";
import { MeleeAttack } from "../../modules/attackModule/meleeAttack";
import { Entity } from "../entity";
import { entity } from "@colyseus/schema";

const petAttack: IWeapon = {
  _id: "pet_attack",
  attackForce: 0,
  attackSpeed: 20,
  damage: 10,
  damageBonuses: [],
  damageType: "bludgeoning",
  description: "",
  group: "misc",
  name: "attack",
  requiredLevel: 0,
  traits: [],
};

@entity
export class Pet extends Entity {
  ownerId: string;
  goapAgent: GoapAgent;
  potentialOwnerId: string;

  constructor(world: GameRoom, id: string, pet?: IPet) {
    super(world);

    this.id = id;
    this.width = 0;
    this.height = 16;
    this.entityType = "PET";
    this.appearance.set("sprite", `pet_${id}`);

    this.ownerId = "-1";
    this.potentialOwnerId = "";

    if (pet) {
      this.ownerId = pet.ownerId;
      this.potentialOwnerId = pet.potentialOwnerId;
    }

    this.party = 3;

    this.autoAttack = new MeleeAttack(this, petAttack);
    this.goapAgent = new PetGoapAgent(this);

    this.finalStats.HP = 100;
  }

  updatePhysics(): void {
    super.updatePhysics();

    if (this.accelDir.x !== 0 || this.accelDir.y !== 0) {
      this.direction = getDirectionFromVector({
        x: this.accelDir.x,
        y: this.accelDir.y,
      });
    }

    if (this.z > 0) {
      this.state = "jump";
    }

    if (this.z <= 0 && this.state === "jump") {
      this.state = "idle";
      this.accelDir.x = 0;
      this.accelDir.y = 0;
      this.xVelocity = 0;
      this.yVelocity = 0;
    }
  }

  jump(): void {
    this.zVelocity = 140;
    this.goapAgent.worldState["state"] = "jump";
  }

  stun(duration: number) {
    this.goapAgent.worldState["stunned"] = duration;
  }

  update() {
    this.goapAgent.update();
    this.updatePhysics();

    for (const feat of this.feats) feat.update();

    for (let statusEffect of this.statusEffects) {
      statusEffect.update();
    }
  }

  kill() {
    this.HP = this.finalStats.HP;
  }

  tame() {
    this.ownerId = this.potentialOwnerId;

    petModel
      .findByIdAndUpdate(this.id, {
        ownerId: this.ownerId,
      })
      .then(() => {
        this.goapAgent = new PetGoapAgent(this);
        this.world.handleChatMessage({
          content: `${this.id} has been tamed`,
          systemMessage: true,
        });
      });
  }

  logOut(){
    this.world.state.entities.delete(this.id);
  }
}
