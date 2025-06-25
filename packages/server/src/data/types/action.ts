export interface Action {
    type: string;
    room_id: string;
    entity_id: string;
    action: string;
    target_id: string;
    count: number;
    dialogue: string;
    subject: string;
}