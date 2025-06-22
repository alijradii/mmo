export interface Action {
    type: string;
    room_id: string;
    entity_id: string;
    action: string;
    target: string;
    count: number;
    dialogue: string;
}