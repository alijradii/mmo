import { Entity } from "../../entity";

export class Planner {
    public entity: Entity;
    public isThinking = false;

    constructor(entity: Entity) {
        this.entity = entity;
    }

    async think() {}
}