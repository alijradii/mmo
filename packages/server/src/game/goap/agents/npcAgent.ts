import { GoapAgent } from "../core/goapAgent";
import { AttackAction } from "../actions/attackAction";
import { FollowEntityAction } from "../actions/followEntityAction";
import { EnemyProximitySensor } from "../sensors/enemyProximitySensor";
import { Goal } from "../core/goal";
import { Action } from "../core/action";
import { Entity } from "../../entities/entity";
import { AllyProximitySensor } from "../sensors/allyProximitySensor";
import { UseFeatAction } from "../actions/useFeatAction";

export class NpcAgent extends GoapAgent {
  constructor(entity: Entity) {
    super(entity);
    this.sensors.push(new EnemyProximitySensor(600, 200));
    this.sensors.push(new AllyProximitySensor(600, 200));
  }

  override updateGoals() {
    this.goals = [];
    this.goals.push(new Goal("idle", 1, { state: "idle" }, this.entity));

    const enemyId = this.worldState["enemy_id"];
    const allyId = this.worldState["ally_id"];

    if (enemyId) {
      this.goals.push(
        new Goal(
          `attack_${enemyId}`,
          5,
          { [`attack_${enemyId}`]: true },
          this.entity
        )
      );
    }

    if (allyId) {
      const hpPercent = this.worldState["ally_hp_percent"] || 100;

      this.goals.push(
        new Goal(
          `support_${allyId}`,
          hpPercent < 50 ? 8 : 3,
          { [`support_${allyId}`]: true },
          this.entity
        )
      );
    }
  }

  override updateActions() {
    const entities = this.entity.world.getAllEntities();
    this.actions = [];
    this.actions.push(new Action("idle", 1, {}, { state: "idle" }));

    const enemyId = this.worldState["enemy_id"];

    if (enemyId) {
      const target = entities.find((a) => a.id === enemyId);
      if (target) {
        this.actions.push(new FollowEntityAction(this.entity, target, 4));
        this.actions.push(
          new AttackAction(this.entity, target, this.entity.autoAttack)
        );

        for (const feat of this.entity.feats) {
          if (feat.category !== "offensive") continue;

          this.actions.push(new UseFeatAction(this.entity, enemyId, feat));
        }
      }
    }

    const allyId = this.worldState["ally_id"];
    if (allyId) {
      const ally = entities.find((a) => a.id === allyId);
      if (ally) {
        this.actions.push(new FollowEntityAction(this.entity, allyId, 4));

        for (const feat of this.entity.feats) {
          if (feat.category !== "support") continue;

          this.actions.push(new UseFeatAction(this.entity, ally, feat));
        }
      }
    }
  }
}
