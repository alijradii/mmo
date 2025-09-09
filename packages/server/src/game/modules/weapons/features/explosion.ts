import { IWeapon } from "../../../../database/models/weapon.model";
import { Rectangle } from "../../../../utils/hitboxes";
import { MeleeAttack } from "../../attackModule/meleeAttack";
import { WeaponFeatureArgs } from "./interfaces";

const explosionWeapon: IWeapon = {
  _id: "explosion",
  attackForce: 300,
  attackSpeed: 0,
  damage: 10,
  damageBonuses: [],
  damageType: "bludgeoning",
  description: "",
  group: "sword",
  name: "explosion",
  requiredLevel: 0,
  traits: [],
};

export const explosionFeature = ({
  x,
  y,
  entity,
}: WeaponFeatureArgs) => {
  const width = 48;
  const getHitBoxRect = (): Rectangle => {
    return {
      x: x - width / 2,
      y: y - width / 2,
      width: width,
      height: width,
    };
  };

  const attack = new MeleeAttack(entity, explosionWeapon, getHitBoxRect);
  attack.execute();

  entity.world.broadcast("particle-spawn", {
    x,
    y,
    name: "warrior1",
  });
};
