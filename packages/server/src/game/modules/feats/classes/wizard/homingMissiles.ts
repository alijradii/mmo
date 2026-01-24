import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../../database/models/weapon.model";
import { Vec2Normalize } from "../../../../../utils/math/vec2";
import { Entity } from "../../../../entities/entity";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";

@entity
export class HomingMissilesFeat extends Feat {
    constructor(entity: Entity) {
        super("homing_missiles", entity);

        this.cooldown = 25;
    }

    effect() {
        const projectileCount = 6;
        const delayBetweenShots = 150; // milliseconds between each projectile
        const spread = 30; // degrees
        const speed = 350;
        const range = 80;
        const damage = this.entity.finalStats.INT * 1.5;

        const delta = Vec2Normalize({
            x: this.entity.deltaX,
            y: this.entity.deltaY,
        });

        if (delta.x === 0 && delta.y === 0) return;

        // Fire projectiles in succession
        for (let i = 0; i < projectileCount; i++) {
            setTimeout(() => {
                const homingMissilesWeapon: IWeapon = {
                    _id: "homing_missiles",
                    attackForce: 150,
                    attackSpeed: 0,
                    damage: damage,
                    damageBonuses: [],
                    damageType: "force",
                    description: "",
                    group: "misc",
                    name: "homing_missiles",
                    requiredLevel: 0,
                    traits: ["homing"],

                    projectile: "arrow_of_light",
                    projectileCount: 1, // Fire one at a time
                    projectileRange: range,
                    projectileSpeed: speed,
                    projectileSpread: spread,
                };

                const homingMissilesAttack: RangedAttack = new RangedAttack(
                    this.entity,
                    homingMissilesWeapon
                );

                homingMissilesAttack.execute();
            }, i * delayBetweenShots);
        }
    }
}

