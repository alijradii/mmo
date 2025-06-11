import WebSocket from 'ws';

export class AIClient {
  private ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      console.log('[AI] Connected to AI server');
    });

    this.ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      this.handleMessage(message);
    });
  }

  send(data: any) {
    this.ws.send(JSON.stringify(data));
  }

  handleMessage(msg: any) {
    console.log(msg)

    // if (msg.type === 'action') {
    //   console.log(`[AI] Entity ${msg.entity_id} should: ${msg.action} "${msg.content}"`);
    // }
  }
}

export const aiClient = new AIClient("ws://localhost:4073/ws")
