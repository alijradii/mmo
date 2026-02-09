import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../../database/models/weapon.model";
import { Vec2Normalize } from "../../../../../utils/math/vec2";
import { Entity } from "../../../../entities/entity";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";

@entity
export class ShurikenFeat extends Feat {
    constructor(entity: Entity) {
        super("shuriken", entity);

        this.cooldown = 25;
    }

    effect() {
        const speed = 350;
        const range = 80;
        const damage = this.entity.finalStats.DEX * 2;

        const delta = Vec2Normalize({
            x: this.entity.deltaX,
            y: this.entity.deltaY,
        });

        if (delta.x === 0 && delta.y === 0) return;

        const shurikenWeapon: IWeapon = {
            _id: "shuriken",
            attackForce: 150,
            attackSpeed: 0,
            damage: damage,
            damageBonuses: [],
            damageType: "slashing",
            description: "",
            group: "misc",
            name: "shuriken",
            requiredLevel: 0,
            traits: ["homing", "piercing"],

            projectile: "shuriken",
            projectileRange: range,
            projectileSpeed: speed,
        };

        const shurikenAttack: RangedAttack = new RangedAttack(
            this.entity,
            shurikenWeapon
        );

        shurikenAttack.execute();
    }
}

