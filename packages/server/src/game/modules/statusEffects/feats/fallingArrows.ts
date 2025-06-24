import { IWeapon } from "../../../../database/models/weapon.model";
import { Rectangle } from "../../../../utils/hitboxes";
import { MeleeAttack } from "../../attackModule/meleeAttack";
import { StatusEffect } from "../statusEffect";

interface FallingArrowsProps {
  duration: number;
  amount: number;
  interval?: number;
}

export class FallingArrowsStatusEffect extends StatusEffect {
  constructor({ duration, amount, interval = 1 }: FallingArrowsProps) {
    super("falling_arrows", duration, interval);
    this.amount = amount;
  }

  effect(): void {
    const fallingArrowWeapon: IWeapon = {
      _id: "falling_arrow",
      attackForce: 0,
      attackSpeed: 0,
      damage: this.entity.finalStats.DEX,
      damageBonuses: [],
      damageType: "slashing",
      description: "",
      group: "misc",
      name: "falling_arrow",
      requiredLevel: 0,
      traits: [],
    };

    const width = 48;
    const minRadius = 32;
    const maxRadius = 96;

    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;

    const getHitBoxRect = (): Rectangle => {
      return {
        x: this.entity.x + offsetX - width / 2,
        y: this.entity.y + offsetY - width / 2,
        width: width,
        height: width,
      };
    };

    const attack = new MeleeAttack(
      this.entity,
      fallingArrowWeapon,
      getHitBoxRect
    );
    attack.execute();

    this.entity.world.broadcast("particle-spawn", {
      x: this.entity.x + offsetX,
      y: this.entity.y + offsetY,
      name: "arrow_fall",
    });
  }
}
