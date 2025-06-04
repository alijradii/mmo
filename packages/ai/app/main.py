from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from models.world_manager import WorldManager
from models.engine import Engine

app = FastAPI()
world_manager = WorldManager()
engine = Engine(world_manager)

@app.on_event("startup")
async def startup_event():
    engine.start()

@app.on_event("shutdown")
async def shutdown_event():
    engine.stop()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connected")

    try:
        while True:
            message = await websocket.receive_json()
            if message.get("type") == "game_state":
                room_id = message.get("id")
                data = message.get("data")
                world_manager.update_world(room_id, data)

    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print("WebSocket error:", e)
