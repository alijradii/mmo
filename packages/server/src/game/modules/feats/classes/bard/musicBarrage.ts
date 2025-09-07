import { IWeapon } from "../../../../../database/models/weapon.model";
import { Vec2Normalize } from "../../../../../utils/math/vec2";
import { Projectile } from "../../../../core/projectile";
import { Entity } from "../../../../entities/entity";
import { Player } from "../../../../player/player";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

@entity
export class MusicBarrageFeat extends Feat {
  constructor(entity: Entity) {
    super("music_barrage", entity);
    this.cooldown = 30;
  }

  effect() {
    const weapon: IWeapon = {
      _id: "music_barrage",
      attackForce: 0,
      attackSpeed: 0,
      damage: Math.max(1, Math.floor(this.entity.finalStats.INT * 0.2)), // weak
      damageBonuses: [],
      damageType: "sonic",
      description: "A flurry of weak musical notes",
      group: "misc",
      name: "music_barrage",
      requiredLevel: 0,
      traits: [],
    };

    const attack: RangedAttack = new RangedAttack(this.entity, weapon);

    const baseSpeed = 280;

    const delta = Vec2Normalize({
      x: this.entity.deltaX,
      y: this.entity.deltaY,
    });

    if (delta.x === 0 && delta.y === 0) return;

    if (this.entity instanceof Player) {
      for (let i = 0; i < 20; i++) {
        const delay = i * randomInt(30, 80); // ms spacing

        setTimeout(() => {
          // add angular spread
          const spreadAngle = randomInt(-30, 30);
          const angleRad = degToRad(spreadAngle);

          const vx =
            delta.x * Math.cos(angleRad) - delta.y * Math.sin(angleRad);
          const vy =
            delta.x * Math.sin(angleRad) + delta.y * Math.cos(angleRad);

          const noteIndex = randomInt(1, 5);

          new Projectile({
            x: this.entity.x,
            y: this.entity.y,
            z: 0,
            xVelocity: vx * baseSpeed * randomFloat(0.8, 1.2),
            yVelocity: vy * baseSpeed * randomFloat(0.8, 1.2),
            zVelocity: 0,
            lifespan: 70 + randomInt(-10, 20),
            world: this.entity.world,
            attack,
            name: `music_note_${noteIndex}`,
          });
        }, delay);
      }
    }
  }
}
