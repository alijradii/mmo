import { State } from "../../genericStates/state";
import { NPC } from "../npcs";

export class NPCIdleState extends State{
    constructor(entity: NPC){
        super("idle", entity);
    }
}