import { Player } from "../../player/player";
import { BigBombFeat } from "./classes/artificer/bigBomb";
import { BombClusterFeat } from "./classes/artificer/bombCluster";
import { GunBarrageFeat } from "./classes/artificer/gunBarrage";
import { AssassinateFeat } from "./classes/assassin/assassinate";
import { CaltropsFeat } from "./classes/assassin/caltrops";
import { FanOfKnivesFeat } from "./classes/assassin/fanOfKnives";
import { IcelaneFeat } from "./classes/assassin/icelane";
import { ShadowStepFeat } from "./classes/assassin/shadowstep";
import { HallowedGroundFeat } from "./classes/cleric/hallowedGround";
import { HammerOfJusticeFeat } from "./classes/cleric/hammerOfJustice";
import { HealFeat } from "./classes/cleric/heal";
import { RegenerationFeat } from "./classes/cleric/regeneration";
import { SmiteFeat } from "./classes/cleric/smite";
import { VirtueOfMightFeat } from "./classes/cleric/virtueOfMight";
import { VirtueOfProtectionFeat } from "./classes/cleric/virtueOfProtection";
import { VirtueOfRenewalFeat } from "./classes/cleric/virtueOfRenewal";
import { ExplosiveArrowFeat } from "./classes/ranger/explosiveArrow";
import { FallingArrowFeat } from "./classes/ranger/fallingArrow";
import { ImpalingSpikeFeat } from "./classes/ranger/impalingSpike";
import { MultishotFeat } from "./classes/ranger/multishot";
import { PlaceBombFeat } from "./classes/ranger/placeBomb";
import { EarthBreakFeat } from "./classes/warrior/ earthBreak";
import { BattleCry } from "./classes/warrior/battleCry";
import { CleaveFeat } from "./classes/warrior/cleave";
import { DoubleSlash } from "./classes/warrior/doubleSlash";
import { PlaceHolder1Feat } from "./classes/warrior/placeholder-1";
import { PlaceHolder2Feat } from "./classes/warrior/placeholder-2";
import { SecondWind } from "./classes/warrior/secondWind";
import { SlashFeat } from "./classes/warrior/slash";
import { ToughAsNailsFeat } from "./classes/warrior/toughAsNails";
import { FireBallFeat } from "./classes/wizard/fireBall";
import { FireBurstFeat } from "./classes/wizard/fireBurst";
import { HomingMissilesFeat } from "./classes/wizard/homingMissiles";
import { LightningStormFeat } from "./classes/wizard/lightningStorm";
import { Feat } from "./feat";
import { DashFeat } from "./generic/dash";

export const featFactory = (player: Player): Feat[] => {
    if (!player.iclass) return [];

    switch (player.iclass._id) {
        case "assassin":
            return [
                new DashFeat(player),
                new ShadowStepFeat(player),
                new FanOfKnivesFeat(player),
                new AssassinateFeat(player),
                new IcelaneFeat(player),
                new CaltropsFeat(player),
                new SecondWind(player),
            ];
        case "wizard":
            return [
                new LightningStormFeat(player),
                new FireBurstFeat(player),
                new FireBallFeat(player),
                new SecondWind(player),
                new ShadowStepFeat(player),
                new HomingMissilesFeat(player),
                new DashFeat(player),
            ];
        case "cleric":
            return [
                new RegenerationFeat(player),
                new SmiteFeat(player),
                new HealFeat(player),
                new HammerOfJusticeFeat(player),
                new VirtueOfMightFeat(player),
                new VirtueOfProtectionFeat(player),
                new VirtueOfRenewalFeat(player),
                new HallowedGroundFeat(player),
            ];
        case "bard":
            return [
            ];
        case "ranger":
            return [
                new FallingArrowFeat(player),
                new ImpalingSpikeFeat(player),
                new PlaceBombFeat(player),
                new ExplosiveArrowFeat(player),
                new GunBarrageFeat(player),
                new MultishotFeat(player),
                new SecondWind(player),
            ];
        case "warrior":
            return [
                new SlashFeat(player),
                new CleaveFeat(player),
                new DoubleSlash(player),
                new PlaceHolder1Feat(player),
                new PlaceHolder2Feat(player),
                new EarthBreakFeat(player),
                new RegenerationFeat(player),
                new ToughAsNailsFeat(player),
                new SecondWind(player),
                new BattleCry(player),
            ];
        case "artificer":
            return [new BombClusterFeat(player), new GunBarrageFeat(player), new BigBombFeat(player)];
    }
    return [];
};
