import { statusEffectFactory } from "../statusEffects/statusEffectFactory";
import { Entity } from "../../entities/entity";
import { WeaponStatusEffect } from "../../../database/models/weapon.model";

export function applyStatusEffects(entity: Entity, effects: WeaponStatusEffect[]) {
  for (let effect of effects || []) {
    entity.addStatusEffect(statusEffectFactory(effect));
  }
}
