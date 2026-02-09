import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Vec2Normalize } from "../../../../../utils/math/vec2";
import { Entity } from "../../../../entities/entity";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";

function getDirectionOffset(direction: string): { dx: number; dy: number } {
  switch (direction) {
    case "up":
      return { dx: 0, dy: -1 };
    case "down":
      return { dx: 0, dy: 1 };
    case "left":
      return { dx: -1, dy: 0 };
    case "right":
      return { dx: 1, dy: 0 };
    default:
      return { dx: 0, dy: 1 };
  }
}

@entity
export class FirePillarsFeat extends Feat {
  constructor(entity: Entity) {
    super("fire_pillars", entity);

    this.cooldown = 20;
  }

  effect() {
    const firePillarWeapon: IWeapon = {
      _id: "fire_pillar",
      attackForce: 600,
      attackSpeed: 0,
      damage: this.entity.finalStats.INT,
      damageBonuses: [],
      damageType: "fire",
      description: "",
      group: "misc",
      name: "fire_pillar",
      requiredLevel: 0,
      traits: [],
    };

    const width = 60;
    const spacing = 60;
    const pillarCount = 6;
    const delayBetweenPillars = 120; // ms

    const aim = Vec2Normalize({
      x: this.entity.deltaX,
      y: this.entity.deltaY,
    });
    const fallback = getDirectionOffset(this.entity.direction);
    const dx =
      aim.x !== 0 || aim.y !== 0 ? aim.x : fallback.dx;
    const dy =
      aim.x !== 0 || aim.y !== 0 ? aim.y : fallback.dy;

    const startX = this.entity.x;
    const startY = this.entity.y;

    for (let i = 0; i < pillarCount; i++) {
      setTimeout(() => {
        const offsetX = (i + 0.5) * spacing * dx;
        const offsetY = (i + 0.5) * spacing * dy;

        const getHitBoxRect = (): Rectangle => {
          return {
            x: startX + offsetX - width / 2,
            y: startY + offsetY - width / 2,
            width: width,
            height: width,
          };
        };

        const attack = new MeleeAttack(
          this.entity,
          firePillarWeapon,
          getHitBoxRect
        );
        attack.execute();

        this.entity.world.broadcast("particle-spawn", {
          x: startX + offsetX,
          y: startY + offsetY,
          name: "fire_pillar",
        });
      }, i * delayBetweenPillars);
    }
  }
}
