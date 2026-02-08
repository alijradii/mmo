import { statusEffectFactory } from "../modules/statusEffects/statusEffectFactory";
import { Player } from "./player";

interface CachedFeatState {
    name: string;
    cooldownEndTime: number;
    isReady: boolean;
}

interface CachedStatusEffect {
    name: string;
    remainingDuration: number;
    stacks: number;
    amount: number;
    effectInterval: number;
}

interface CachedPlayerState {
    HP: number;
    TEMP_HP: number;
    MP: number;
    feats: CachedFeatState[];
    statusEffects: CachedStatusEffect[];
    cachedAt: number;
}

const DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes

export class PlayerStateCache {
    private cache = new Map<string, CachedPlayerState>();
    private ttl: number;

    constructor(ttl: number = DEFAULT_TTL) {
        this.ttl = ttl;
    }

    save(playerId: string, player: Player): void {
        const now = Date.now();

        const feats: CachedFeatState[] = [];
        for (const feat of player.feats) {
            feats.push({
                name: feat.name,
                cooldownEndTime: feat.cooldownEndTime,
                isReady: feat.isReady,
            });
        }

        const statusEffects: CachedStatusEffect[] = [];
        for (const effect of player.statusEffects) {
            const remaining = effect.duration - (now - effect.startTime);
            if (remaining > 0) {
                statusEffects.push({
                    name: effect.name,
                    remainingDuration: remaining,
                    stacks: effect.stacks,
                    amount: effect.amount,
                    effectInterval: effect.effectInterval,
                });
            }
        }

        this.cache.set(playerId, {
            HP: player.HP,
            TEMP_HP: player.TEMP_HP,
            MP: player.MP,
            feats,
            statusEffects,
            cachedAt: now,
        });
    }

    /**
     * Restores cached volatile state onto a freshly-created Player.
     * Returns true if cached state was found and applied.
     */
    restore(playerId: string, player: Player): boolean {
        const cached = this.get(playerId);
        if (!cached) return false;

        // Restore HP (capped at current max so we don't exceed finalStats)
        player.HP = Math.min(cached.HP, player.finalStats.HP);
        player.TEMP_HP = cached.TEMP_HP;
        player.MP = cached.MP;

        // Restore feat cooldowns by matching name
        for (const savedFeat of cached.feats) {
            const feat = player.feats.find((f) => f.name === savedFeat.name);
            if (feat) {
                feat.cooldownEndTime = savedFeat.cooldownEndTime;
                feat.isReady = savedFeat.isReady;
            }
        }

        // Restore status effects by recreating them through the factory
        for (const saved of cached.statusEffects) {
            try {
                const effect = statusEffectFactory({
                    name: saved.name,
                    duration: saved.remainingDuration,
                    amount: saved.amount,
                    interval: saved.effectInterval,
                });
                // Manually wire up the effect instead of going through
                // entity.addStatusEffect / effect.initialize to avoid the
                // double-add path and keep restoration predictable.
                effect.entity = player;
                effect.startTime = Date.now();
                effect.stacks = saved.stacks;
                player.statusEffects.push(effect);
                effect.onEnter();
            } catch {
                // Status effect type not recognized by factory, skip it
            }
        }

        // Recalculate final stats so restored status effects apply their conditions
        player.resetFinalStats();

        this.remove(playerId);
        return true;
    }

    private get(playerId: string): CachedPlayerState | null {
        const state = this.cache.get(playerId);
        if (!state) return null;

        if (Date.now() - state.cachedAt > this.ttl) {
            this.cache.delete(playerId);
            return null;
        }

        return state;
    }

    private remove(playerId: string): void {
        this.cache.delete(playerId);
    }

    /** Evict entries that have exceeded the TTL. */
    cleanup(): void {
        const now = Date.now();
        for (const [id, state] of this.cache) {
            if (now - state.cachedAt > this.ttl) {
                this.cache.delete(id);
            }
        }
    }
}
