import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../entity";
import { Bat } from "./all/bat";
import { LanternPhantom } from "./all/lanternphantom";
import { SkeletonArcher } from "./all/skeletonArcher";
import { SkeletonAssassin } from "./all/skeletonAssassin";
import { SkeletonBerserker } from "./all/skeletonBerserker";
import { SkeletonWarrior } from "./all/skeletonWarrior";
import { Wasp } from "./all/wasp";

export const MobFactory = (mobName: string, world: GameRoom): Entity => {
  switch (mobName) {
    case "SkeletonArcher":
      return new SkeletonArcher(world);
    case "SkeletonWarrior":
      return new SkeletonWarrior(world);
    case "SkeletonAssassin":
      return new SkeletonAssassin(world);
    case "SkeletonBerserker":
      return new SkeletonBerserker(world);
    case "Bat":
      return new Bat(world);
    case "Wasp":
      return new Wasp(world);
    case "LanternPhantom":
      return new LanternPhantom(world);
  }

  throw new Error(`trying to spawn mob; mob name not found - name: ${mobName}`);
};
