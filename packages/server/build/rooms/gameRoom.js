"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const core_1 = require("@colyseus/core");
const gameState_1 = require("../models/gameState");
const player_1 = require("../models/player");
const auth_1 = require("@colyseus/auth");
class GameRoom extends core_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 100;
        this.fixedTimeStep = 1000 / 40;
    }
    static async onAuth(token, request) {
        return await auth_1.JWT.verify(token);
    }
    onCreate(options) {
        this.setState(new gameState_1.GameState());
        this.onMessage("input", (client, input) => {
            const player = this.state.players.get(client.auth.id);
            if (player) {
                player.inputQueue.push(input);
            }
        });
        let elapsedTime = 0;
        this.setSimulationInterval((deltaTime) => {
            elapsedTime += deltaTime;
            while (elapsedTime >= this.fixedTimeStep) {
                elapsedTime -= this.fixedTimeStep;
                this.fixedTick(this.fixedTimeStep);
            }
        });
    }
    onJoin(client, options) {
        console.log(`Client joined: ${client.auth.id}`);
        const player = new player_1.Player();
        player.id = client.auth.id;
        this.state.players.set(client.auth.id, player);
    }
    onLeave(client, consented) {
        console.log(`Client left: ${client.auth.id}`);
        if (this.state.players.has(client.auth.id))
            this.state.players.delete(client.auth.id);
    }
    fixedTick(timeStep) {
        const velocity = 2;
        this.state.players.forEach((player) => {
            let input;
            while (input = player.inputQueue.shift()) {
                if (input.left) {
                    player.x -= velocity;
                }
                else if (input.right) {
                    player.x += velocity;
                }
                if (input.up) {
                    player.y -= velocity;
                }
                else if (input.down) {
                    player.y += velocity;
                }
                player.tick = input.tick;
            }
        });
    }
}
exports.GameRoom = GameRoom;
