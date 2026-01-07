import { IWeapon } from "../../../../database/models/weapon.model";
import { Rectangle } from "../../../../utils/hitboxes";
import { MeleeAttack } from "../../attackModule/meleeAttack";
import { WeaponFeatureArgs } from "./interfaces";

const lightningBoltWeapon: IWeapon = {
  _id: "lightning_bolt",
  attackForce: 100,
  attackSpeed: 0,
  damage: 20,
  damageBonuses: [],
  damageType: "electric",
  description: "",
  group: "misc",
  name: "lightning_bolt",
  requiredLevel: 0,
  traits: [],
};

export const lightningStormFeature = ({
  x,
  y,
  entity,
}: WeaponFeatureArgs) => {
  const width = 48;
  const minRadius = 24;
  const maxRadius = 64;
  const bolts = 6;

  for (let i = 0; i < bolts; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;

    const getHitBoxRect = (): Rectangle => {
      return {
        x: x + offsetX - width / 2,
        y: y + offsetY - width / 2,
        width: width,
        height: width,
      };
    };

    const attack = new MeleeAttack(entity, lightningBoltWeapon, getHitBoxRect);
    attack.execute();

    entity.world.broadcast("particle-spawn", {
      x: x + offsetX,
      y: y + offsetY,
      name: "lightning_bolt",
    });
  }
};

