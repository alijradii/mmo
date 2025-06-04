from fastapi import FastAPI, WebSocket
from typing import List
import uvicorn

app = FastAPI()
active_connections: List[WebSocket] = []


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    active_connections.append(ws)
    try:
        while True:
            data = await ws.receive_json()
            response = handle_message(data)
            if response:
                await ws.send_json(response)
    except:
        active_connections.remove(ws)

def handle_message(data: dict):
    print(data)

if __name__ == "__main__":
    uvicorn.run("ai_server:app", host="0.0.0.0", port=4073)