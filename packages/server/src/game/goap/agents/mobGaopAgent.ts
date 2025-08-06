import { GoapAgent } from "../core/goapAgent";
import { AttackAction } from "../actions/attackAction";
import { FollowEntityAction } from "../actions/followEntityAction";
import { EnemyProximitySensor } from "../sensors/enemyProximitySensor";
import { Goal } from "../core/goal";
import { Entity } from "../../entities/entity";
import { IdleAction } from "../actions/idleAction";

export class MobGoapAgent extends GoapAgent {
  constructor(entity: Entity) {
    super(entity);
    this.sensors.push(new EnemyProximitySensor(320, 150));
  }

  override async updateGoals() {
    this.goals = [];

    const enemyId = this.worldState["enemy_id"];
    this.goals.push(
      new Goal("idle", 1, { state: "idle", idling: true }, this.entity)
    );

    if (enemyId === undefined) return;

    this.goals.push(
      new Goal(
        `attack_${enemyId}`,
        5,
        { [`attack_${enemyId}`]: true },
        this.entity
      )
    );
  }

  override async updateActions() {
    const entities = this.entity.world.getAllEntities();
    this.actions = [];
    this.actions.push(new IdleAction(this.entity));

    const enemyId = this.worldState["enemy_id"];

    if (!enemyId) return;

    const target = entities.find((a) => a.id === enemyId);
    if (target) {
      this.actions.push(new FollowEntityAction(this.entity, target, 4));
      this.actions.push(
        new AttackAction(this.entity, target, this.entity.autoAttack)
      );
    }
  }
}
