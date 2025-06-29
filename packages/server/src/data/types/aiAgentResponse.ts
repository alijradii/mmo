export interface AiAgentResponse {
  type: string;
  room_id: string;
  entity_id: string;

  goal?: {
    name: string;
    description: string;
    desired_world_state: { ["string"]: any };
    terminate_world_state: { ["string"]: any };
    dialogue: string;
  };
}
