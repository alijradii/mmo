import { Entity } from "../../entities/entity";

export class attackerComponent {
    entity: Entity; 
    
    constructor(entity: Entity) {
        this.entity = entity;
    }
}