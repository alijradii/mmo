import { GoapAgent } from "../core/goapAgent";
import { AttackAction } from "../actions/attackAction";
import { FollowEntityAction } from "../actions/followEntityAction";
import { EnemyProximitySensor } from "../sensors/enemyProximitySensor";
import { Goal } from "../core/goal";
import { Entity } from "../../entities/entity";
import { AllyProximitySensor } from "../sensors/allyProximitySensor";
import { UseFeatAction } from "../actions/useFeatAction";
import { IdleAction } from "../actions/idleAction";
import { FleeAction } from "../actions/fleeAction";
import { TrackingProximitySensor } from "../sensors/trackingProximitySensor";

export class NpcAgent extends GoapAgent {
  constructor(entity: Entity) {
    super(entity);
    this.sensors.push(new EnemyProximitySensor(300, 120));
    this.sensors.push(new AllyProximitySensor(600, 200));
    this.sensors.push(new TrackingProximitySensor(600, 200));
  }

  override async updateGoals() {
    this.goals = this.goals.filter((g) => g.presistent);

    this.goals.push(
      new Goal("idle", 1, { state: "idle", idling: true }, this.entity)
    );

    const enemyId = this.worldState["enemy_id"];
    const allyId = this.worldState["ally_id"];

    const entities = this.entity.world.getAllEntities();

    if (enemyId) {
      const enemy = entities.find((a) => a.id === enemyId);

      if (enemy && enemy.party === -1)
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
          `follow_${allyId}`,
          2,
          { [`within_range_${allyId}`]: true },
          this.entity
        )
      );

      if (hpPercent < 80)
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

  override async updateActions() {
    const entities = this.entity.world.getAllEntities();
    this.actions = [];
    this.actions.push(new IdleAction(this.entity));

    const allyId = this.worldState["ally_id"];
    const enemyId = this.worldState["enemy_id"];
    const trackedId = this.worldState["tracked_id"];

    if (trackedId) {
      const trackedEntity = entities.find((e) => e.id === trackedId);

      if (trackedEntity) {
        this.actions.push(
          new FollowEntityAction(this.entity, trackedEntity, 4)
        );
        this.actions.push(
          new AttackAction(this.entity, trackedEntity, this.entity.autoAttack)
        );
        this.actions.push(new FleeAction(this.entity, trackedEntity, 100));

        for (const feat of this.entity.feats) {
          this.actions.push(
            new UseFeatAction(this.entity, trackedEntity, feat)
          );
        }
      }
    }

    if (enemyId && enemyId !== trackedId) {
      const target = entities.find((a) => a.id === enemyId);
      if (target) {
        this.actions.push(new FollowEntityAction(this.entity, target, 4));
        this.actions.push(
          new AttackAction(this.entity, target, this.entity.autoAttack)
        );
        this.actions.push(new FleeAction(this.entity, target, 100));

        for (const feat of this.entity.feats) {
          if (feat.category !== "offensive") continue;

          this.actions.push(new UseFeatAction(this.entity, target, feat));
        }
      }
    }

    const allyHealthPercent = this.worldState["ally_hp_percent"];

    if (allyId && allyId !== trackedId) {
      const ally = entities.find((a) => a.id === allyId);
      if (ally) {
        this.actions.push(new FollowEntityAction(this.entity, ally, 4));
        this.actions.push(new FleeAction(this.entity, ally, 100));
      }

      if (ally && allyHealthPercent && allyHealthPercent < 100) {
        for (const feat of this.entity.feats) {
          if (feat.category !== "support" || !feat.isReady) continue;

          this.actions.push(new UseFeatAction(this.entity, ally, feat));
        }
      }
    }
  }
}
