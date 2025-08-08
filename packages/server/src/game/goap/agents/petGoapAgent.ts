import { GoapAgent } from "../core/goapAgent";
import { Goal } from "../core/goal";
import { Pet } from "../../entities/pets/pet";
import { NearestSensor } from "../sensors/nearestSensor";
import { FleeAction } from "../actions/fleeAction";
import { TrackerSensor } from "../sensors/trackerSensor";
import { FollowEntityAction } from "../actions/followEntityAction";
import { IdleAction } from "../actions/idleAction";
import { UseFeatAction } from "../actions/useFeatAction";

export class PetGoapAgent extends GoapAgent {
  declare entity: Pet;
  constructor(entity: Pet) {
    super(entity);

    if (this.entity.ownerId === "-1") this.sensors.push(new NearestSensor());
    else this.sensors.push(new TrackerSensor(this.entity.ownerId));
  }

  override async updateGoals() {
    this.goals = [];

    this.goals.push(
      new Goal("idle", 1, { state: "idle", idling: true }, this.entity)
    );

    if (this.entity.ownerId === "-1") {
      this.goals.push(new Goal("safe", 1, { danger: false }));
      return;
    }

    const owner = this.entity.world.state.players.get(this.entity.ownerId);
    if (!owner) {
      this.entity.logOut();
      console.log(`${this.entity.id} has logged out`);
      return;
    }

    this.goals.push(
      new Goal(
        `follow_${owner}`,
        2,
        { [`within_range_${owner.id}`]: true },
        this.entity
      )
    );
  }

  override async updateActions() {
    this.actions = [];
    this.actions.push(new IdleAction(this.entity));

    if (!this.worldState["entity_id"]) return;
    const threatEntity = this.entity.world
      .getAllEntities()
      .find((e) => e.id === this.worldState["entity_id"]);

    if (
      this.entity.ownerId === "-1" &&
      this.worldState["distance"] < 20 &&
      this.worldState["entity_id"] === this.entity.potentialOwnerId
    ) {
      this.entity.tame();
      return;
    }
    if (this.entity.ownerId === "-1" && threatEntity) {
      this.actions.push(new FleeAction(this.entity, threatEntity, 200));
    }

    if (this.entity.ownerId === "-1") {
      return;
    }

    const owner = this.entity.world.state.players.get(this.entity.ownerId);
    if (!owner) {
      this.entity.logOut();
      console.log(`${this.entity.id} has logged out`);
      return;
    }
    this.actions.push(new FollowEntityAction(this.entity, owner, 4));

    for (const feat of this.entity.feats) {
      if (feat.category !== "support" || !feat.isReady) continue;

      this.actions.push(new UseFeatAction(this.entity, owner, feat));
    }
  }
}
