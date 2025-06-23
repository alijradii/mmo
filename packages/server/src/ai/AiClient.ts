import WebSocket from "ws";
import { GameRoom } from "../rooms/gameRoom";
import { Entity } from "../game/entities/entity";

export class AIClient {
  private ws: WebSocket;
  private gameRooms: Map<string, GameRoom> = new Map<string, GameRoom>();

  constructor(url: string) {
    this.ws = new WebSocket(url);

    this.ws.on("open", () => {
      console.log("[AI] Connected to AI server");
    });

    this.ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      this.handleMessage(message);
    });
  }

  send(data: any) {
    this.ws.send(JSON.stringify(data));
  }

  handleMessage(msg: any) {
    console.log(msg);

    if (msg.type === 'action') {
      // console.log(`[AI] Entity ${msg.entity_id} should: ${msg.action} "${msg.content}"`);
      const room: GameRoom | undefined = this.gameRooms.get(msg.room_id);

      if(!room) return;

      const entity: Entity | undefined = room.state.entities.get(msg.entity_id);

      if(!entity) return;
      
      entity.processAction(msg);
    }
  }

  subscribe(gameRoom: GameRoom) {
    this.gameRooms.set(gameRoom.roomId, gameRoom);
  }
}

export const aiClient = new AIClient("ws://localhost:4073/ws");
