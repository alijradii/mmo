export interface AiAgentResponse {
  type: string;
  room_id: string;
  entity_id: string;

  goal?: {
    name: string;
    description: string;
    desired_world_state: { ["string"]: boolean };
    terminate_world_state: { ["string"]: boolean };
    dialogue: string;
  };
}
