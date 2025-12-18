import { eventBus } from "@/game/eventBus/eventBus";
import { SkillUIData } from "@/game/eventBus/types";
import { MainScene } from "@/game/scenes/main";
import {
    AvailablePlayerActions,
    PlayerActionInput,
    PlayerMovementInput,
} from "../../../../../server/src/game/playerInput";

export class PlayerController {
    public showNameTags: boolean = false;

    private scene: MainScene;
    private cursorKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
    private lastGUIChangeTick: number = 0;

    private activeSkill?: SkillUIData;
    private lastZoomTime: number = 0;
    private zoomCooldownTime: number = 20;

    private movementInputPayload: PlayerMovementInput = {
        up: false,
        down: false,
        left: false,
        right: false,
        tick: 0,
    };

    private actionInputPayload: PlayerActionInput = {
        action: AvailablePlayerActions.NONE,
        deltaX: 0,
        deltaY: 0,
        value: 0,
    };

    private mobileMovement: { x: number; y: number; active: boolean } = {
        x: 0,
        y: 0,
        active: false,
    };

    private isMobile: boolean = window.innerWidth < 768;

    constructor(scene: MainScene) {
        this.scene = scene;

        if (!this.scene.player) return;

        this.scene.input.mouse?.disableContextMenu();

        if (this.scene.input.keyboard) {
            this.cursorKeys = this.scene.input.keyboard.addKeys({
                // WASD
                w: Phaser.Input.Keyboard.KeyCodes.W,
                a: Phaser.Input.Keyboard.KeyCodes.A,
                s: Phaser.Input.Keyboard.KeyCodes.S,
                d: Phaser.Input.Keyboard.KeyCodes.D,

                // Arrow keys
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                down: Phaser.Input.Keyboard.KeyCodes.DOWN,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,

                // Other keys
                jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
                z: Phaser.Input.Keyboard.KeyCodes.Z,
                x: Phaser.Input.Keyboard.KeyCodes.X,
                c: Phaser.Input.Keyboard.KeyCodes.C,
            }) as { [key: string]: Phaser.Input.Keyboard.Key };

            const enterKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

            const pKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

            pKey.on("down", () => {
                this.actionInputPayload.action = AvailablePlayerActions.INTERACT;
            });

            enterKey.on("down", () => {
                eventBus.emit("keypressed", "enter");
            });

            const iKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

            iKey.on("down", () => {
                eventBus.emit("toggle-inventory");
            });
        }

        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            // On mobile, only handle attacks on the right side of the screen
            if (this.isMobile) {
                const touchX = pointer.x;
                const joystickAreaWidth = 200; // Approximate joystick area width

                // Don't handle touches in the left joystick area or UI elements
                if (touchX < joystickAreaWidth) {
                    return;
                }
            }

            if (pointer.button === 0 && this.activeSkill) {
                this.setCursorAuto();

                this.actionInputPayload.action = AvailablePlayerActions.FEAT;
                this.actionInputPayload.value = this.activeSkill.index;
                this.actionInputPayload.deltaX = pointer.worldX - this.scene.player.x;
                this.actionInputPayload.deltaY = pointer.worldY - this.scene.player.y;

                this.activeSkill = undefined;
                return;
            }

            if (pointer.button === 0 && this.actionInputPayload.action === AvailablePlayerActions.NONE) {
                const pointer = this.scene.input.activePointer;

                this.actionInputPayload.action = AvailablePlayerActions.ATTACK;
                this.actionInputPayload.deltaX = pointer.worldX - this.scene.player.x;
                this.actionInputPayload.deltaY = pointer.worldY - this.scene.player.y;
            }
        });

        this.initSkillInput();
        this.setCursorAuto();
        this.initInventoryListeners();
        this.initChatListeners();
        this.initAudioListeners();
        this.initMobileInput();
    }

    initMobileInput() {
        eventBus.on("mobile-movement", (movement: { x: number; y: number; active: boolean }) => {
            this.mobileMovement = movement;
        });

        // Listen for zoom changes from mobile zoom control
        eventBus.on("set-zoom", (zoom: number) => {
            this.scene.cameras.main.setZoom(zoom);
            console.log(`Camera zoom set to ${zoom}`);
            // Emit event to notify UI of zoom change
            eventBus.emit("zoom-changed", zoom);
        });
    }

    collectInput(currentTick: number) {
        // Use mobile movement if active, otherwise use keyboard input
        if (this.mobileMovement.active && this.isMobile) {
            const threshold = 0.3; // Dead zone threshold for smoother control
            const x = this.mobileMovement.x;
            const y = this.mobileMovement.y;

            this.movementInputPayload = {
                up: y < -threshold,
                down: y > threshold,
                left: x < -threshold,
                right: x > threshold,
                tick: 0,
            };
        } else {
            this.movementInputPayload = {
                up: this.cursorKeys.w.isDown || this.cursorKeys.up.isDown,
                down: this.cursorKeys.s.isDown || this.cursorKeys.down.isDown,
                left: this.cursorKeys.a.isDown || this.cursorKeys.left.isDown,
                right: this.cursorKeys.d.isDown || this.cursorKeys.right.isDown,
                tick: 0,
            };
        }

        // if (this.cursorKeys.z.isDown && currentTick > this.lastGUIChangeTick + 10) {
        //   this.scene.cameras.main.setZoom((this.scene.cameras.main.zoom % 6) + 1);
        //   this.lastGUIChangeTick = currentTick;
        // }
        this.scene.input.on("wheel", (_pointer: any, _gameObjects: any, _dx: number, dy: number) => {
            const now = this.scene.time.now;

            if (now - this.lastZoomTime < this.zoomCooldownTime) return;

            let zoom = this.scene.cameras.main.zoom;

            if (dy > 0) {
                zoom = Math.max(1, zoom - 1);
            } else if (dy < 0) {
                zoom = Math.min(6, zoom + 1);
            }

            this.scene.cameras.main.setZoom(zoom);
            this.lastZoomTime = now;
        });

        if (this.cursorKeys.c.isDown && currentTick > this.lastGUIChangeTick + 10) {
            eventBus.emit("toggle-gui");
            this.lastGUIChangeTick = currentTick;
        }

        if (this.cursorKeys.x.isDown && currentTick > this.lastGUIChangeTick + 10) {
            this.showNameTags = !this.showNameTags;

            for (const id in this.scene.playerEntities) {
                if (this.scene.playerEntities[id]) {
                    const player = this.scene.playerEntities[id];
                    player.showUsernameText(this.showNameTags);
                }
            }
            this.lastGUIChangeTick = currentTick;
        }

        this.scene.room.send("move", this.movementInputPayload);

        if (this.actionInputPayload.action === AvailablePlayerActions.NONE) {
            if (this.cursorKeys.jump.isDown) {
                this.actionInputPayload.action = AvailablePlayerActions.JUMP;
            }
        }

        if (this.actionInputPayload.action !== AvailablePlayerActions.NONE) {
            this.scene.room.send("action", this.actionInputPayload);
        }
        this.actionInputPayload.action = AvailablePlayerActions.NONE;
    }

    setCursor(cursor: string) {
        this.scene.input.setDefaultCursor(`url(assets/gui/cursors/${cursor}.png) 16 16, auto`);
    }
    setCursorAuto() {
        this.scene.input.setDefaultCursor("url(assets/gui/cursors/auto.png) 16 16, auto");
    }

    setCursorGUI() {
        this.scene.input.setDefaultCursor("url(assets/gui/cursors/gui.png) 16 16, auto");
    }

    setCursorSkill() {
        this.scene.input.setDefaultCursor("url(assets/gui/cursors/skill.png) 16 16, auto");
    }

    initSkillInput() {
        eventBus.on("change-cursor", (cursor: string) => {
            this.setCursor(cursor);
        });

        eventBus.on("use-skill", (skill: SkillUIData) => {
            console.log(skill.name);

            this.setCursorSkill();
            this.activeSkill = skill;
        });

        if (this.scene.input.keyboard) {
            this.scene.input.keyboard.on("keydown", (event: KeyboardEvent) => {
                if (event.code.startsWith("Digit")) {
                    const digit = event.code.replace("Digit", "");
                    let index = parseInt(digit, 10) - 1;
                    if (digit === "0") index = 9;

                    if (index < 0 || index >= this.scene.player.schema.feats.length) return;

                    const skillSchema = this.scene.player.schema.feats[index];

                    const skill: SkillUIData = {
                        name: skillSchema.name,
                        isReady: skillSchema.isReady,
                        index,
                        readyAt: skillSchema.cooldownEndTime,
                        cooldown: skillSchema.cooldown,
                    };

                    eventBus.emit("use-skill", skill);
                }
            });
        }
    }

    initInventoryListeners() {
        eventBus.on("inventory-move", ({ source, destination }: { source: number; destination: number }) => {
            this.scene.room.send("inventory-move", { source, destination });
        });

        eventBus.on("inventory-equip", ({ source }) => {
            this.scene.room.send("inventory-equip", { source });
        });

        eventBus.on("inventory-unequip", ({ key, destination }) => {
            this.scene.room.send("inventory-unequip", { key, destination });
        });

        eventBus.on("inventory-drop", ({ key }) => {
            this.scene.room.send("inventory-drop", { source: key });
        });
    }

    initChatListeners() {
        eventBus.on("chat-send", ({ content }: { content: string }) => {
            this.scene.room.send("chat", { content });
        });

        this.scene.room.onMessage("chat", message => {
            eventBus.emit("chat", message);
        });
    }

    initAudioListeners() {
        this.scene.room.onMessage("play-music", message => {
            eventBus.emit("play-music", message);
        });
        this.scene.room.onMessage("happy-birthday", message => {
            eventBus.emit("happy-birthday", message);
        });
    }
}
