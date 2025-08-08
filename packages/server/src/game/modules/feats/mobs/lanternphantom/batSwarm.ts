import { Entity } from "../../../../entities/entity";
import { MobFactory } from "../../../../entities/mobs/mobFactory";
import { GoToState } from "../../../../entities/nonPlayerStates/goToState";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class BatSwarm extends Feat {
  constructor(entity: Entity) {
    super("bat_swarm", entity);

    this.cooldown = 80;
    this.isReady = false;
    this.cooldownEndTime = Date.now() + 30 * 1000;
    this.isReady = false;
  }

  effect() {
    this.entity.setState(
      new GoToState(
        this.entity,
        { x: 1505, y: 346 },
        () => {
          const radius = 120;
          const summons = 12;

          const heightmap = this.entity.world.mapInfo.heightmap;

          for (let i = 0; i < summons; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;

            if (
              heightmap[Math.floor((this.entity.y + offsetY) / 16)]?.[
                Math.floor((this.entity.x + offsetX) / 16)
              ] !== 1
            )
              continue;

            const spawnedUnit = MobFactory("Bat", this.entity.world);
            spawnedUnit.x = this.entity.x + offsetX;
            spawnedUnit.y = this.entity.y + offsetY;
            this.entity.world.spawn(spawnedUnit);
          }
        },
        16
      )
    );
  }
}
