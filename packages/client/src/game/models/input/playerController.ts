import { MainScene } from "@/game/scenes/main";
import {
  AvailablePlayerActions,
  PlayerActionInput,
  PlayerMovementInput,
} from "../../../../../server/src/game/playerInput";
import { eventBus } from "@/game/eventBus/eventBus";
import { SkillUIData } from "@/game/eventBus/types";

export class PlayerController {
  public showNameTags: boolean = false;

  private scene: MainScene;
  private cursorKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private lastGUIChangeTick: number = 0;

  private activeSkill?: SkillUIData;

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

  constructor(scene: MainScene) {
    this.scene = scene;

    this.scene.input.mouse?.disableContextMenu();

    if (this.scene.input.keyboard) {
      this.cursorKeys = this.scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
        z: Phaser.Input.Keyboard.KeyCodes.Z,
        x: Phaser.Input.Keyboard.KeyCodes.X,
      }) as { [key: string]: Phaser.Input.Keyboard.Key };

      const enterKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
      );

      enterKey.on("down", () => {
        eventBus.emit("keypressed", "enter");
      });

      const iKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.I
      );

      iKey.on("down", () => {
        eventBus.emit("toggle-inventory");
      });
    }

    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0 && this.activeSkill) {
        this.setCursorAuto();

        this.actionInputPayload.action = AvailablePlayerActions.FEAT;
        this.actionInputPayload.value = this.activeSkill.index;
        this.actionInputPayload.deltaX = pointer.worldX - this.scene.player.x;
        this.actionInputPayload.deltaY = pointer.worldY - this.scene.player.y;

        this.activeSkill = undefined;
        return;
      }

      if (
        pointer.button === 0 &&
        this.actionInputPayload.action === AvailablePlayerActions.NONE
      ) {
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
  }

  collectInput(currentTick: number) {
    this.movementInputPayload = {
      up: this.cursorKeys.up.isDown,
      down: this.cursorKeys.down.isDown,
      left: this.cursorKeys.left.isDown,
      right: this.cursorKeys.right.isDown,
      tick: 0,
    };

    if (this.cursorKeys.z.isDown && currentTick > this.lastGUIChangeTick + 10) {
      this.scene.cameras.main.setZoom((this.scene.cameras.main.zoom % 3) + 1);
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
    this.scene.input.setDefaultCursor(
      `url(assets/gui/cursors/${cursor}.png) 16 16, auto`
    );
  }
  setCursorAuto() {
    this.scene.input.setDefaultCursor(
      "url(assets/gui/cursors/auto.png) 16 16, auto"
    );
  }

  setCursorGUI() {
    this.scene.input.setDefaultCursor(
      "url(assets/gui/cursors/gui.png) 16 16, auto"
    );
  }

  setCursorSkill() {
    this.scene.input.setDefaultCursor(
      "url(assets/gui/cursors/skill.png) 16 16, auto"
    );
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
  }

  initInventoryListeners() {
    eventBus.on(
      "inventory-move",
      ({ source, destination }: { source: number; destination: number }) => {
        this.scene.room.send("inventory-move", { source, destination });
      }
    );

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

    this.scene.room.onMessage("chat", (message) => {
      eventBus.emit("chat", message);
    });
  }
}
