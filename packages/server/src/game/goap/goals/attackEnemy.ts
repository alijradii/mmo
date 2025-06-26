import { Entity } from "../../entities/entity";
import { Goal } from "../core/goal";
import { WorldState } from "../core/worldState";

export class AttackEnemyGoal extends Goal {
    constructor(target: Entity, entity: Entity) {
        const name = `attack_${target.id}`
        const desiredState: Partial<WorldState> = {};
        desiredState[name] = true;

        super(name, 10, desiredState, entity) 
    }
}