import Phaser from "phaser";
import { BaseScene } from "@/game/scenes/base";
import { PlayerComponent } from "./playerComponent";
import { Player as PlayerSchema } from "@backend/game/player/player";
import { eventBus } from "@/game/eventBus/eventBus";
import { PlayerUIData } from "@/game/eventBus/types";
import { getStateCallbacks } from "colyseus.js";
import { InventoryItem } from "@backend/game/items/inventoryItem";
import { Entity } from "../entity/entity";

type DirectionalDepth = {
  up: number;
  down: number;
  left: number;
  right: number;
};

type PlayerComponents = {
  frontextra?: PlayerComponent;
  backextra?: PlayerComponent;
  hair?: PlayerComponent;
  backhair?: PlayerComponent;
  hat?: PlayerComponent;
  weapon?: PlayerComponent;
  head?: PlayerComponent;
  top?: PlayerComponent;
  bottom?: PlayerComponent;
};

const categories: (keyof PlayerComponents)[] = [
  "backextra",
  "backhair",
  "bottom",
  "frontextra",
  "hair",
  "hat",
  "head",
  "top",
  "weapon",
];

type ComponentsDepthIndex = {
  frontextra: DirectionalDepth;
  backextra: DirectionalDepth;
  hair: DirectionalDepth;
  backhair: DirectionalDepth;
  hat: DirectionalDepth;
  weapon: DirectionalDepth;
  head: DirectionalDepth;
  top: DirectionalDepth;
  bottom: DirectionalDepth;
};

export class Player extends Entity {
  public username: string;
  public components: PlayerComponents = {
    frontextra: undefined,
    backextra: undefined,
    hair: undefined,
    backhair: undefined,
    hat: undefined,
    weapon: undefined,
    head: undefined,
    top: undefined,
    bottom: undefined,
  };

  componetsDepthIndex: ComponentsDepthIndex = {
    frontextra: { up: 4, down: 8, left: 8, right: 8 },
    backextra: { up: 5, down: 1, left: 1, right: 1 },
    hair: { up: 7, down: 6, left: 6, right: 6 },
    backhair: { up: 8, down: 2, left: 4, right: 4 },
    hat: { up: 9, down: 7, left: 7, right: 7 },
    weapon: { up: 1, down: 9, left: 9, right: 9 },
    head: { up: 6, down: 5, left: 5, right: 5 },
    top: { up: 3, down: 4, left: 3, right: 3 },
    bottom: { up: 2, down: 3, left: 2, right: 2 },
  };

  public direction: "up" | "down" | "left" | "right" = "down";
  public state: string;

  public activeCounter: number = 0;

  public schema: PlayerSchema;
  public isMainPlayer: boolean = false;

  public usernameText: Phaser.GameObjects.Text;

  declare scene: BaseScene;
  public shadow: Phaser.GameObjects.Ellipse;

  constructor(scene: BaseScene, schema: PlayerSchema, isMainPlayer: boolean) {
    super(scene, schema, true);

    this.schema = schema;

    this.isMainPlayer = isMainPlayer;
    const $ = getStateCallbacks(scene.room);

    $(this.schema).listen("appearance", () => {
      this.initPlayerAppearance();
    });

    if (this.isMainPlayer) {
      $(this.schema.inventory).listen("items", (items) => {
        const inv: (InventoryItem | null)[] = Array(36).fill(null);

        items.forEach((item: InventoryItem, key: string) => {
          const index = parseInt(key);

          inv[index] = item;
        });

        eventBus.emit("update-inventory", inv);
      });

      $(this.schema.inventory).listen("equipment", (equipment) => {
        const e = {};
        equipment.forEach((item: InventoryItem, key: string) => {
          e[key] = item;
        });

        eventBus.emit("update-equipment", e);
      });
    }

    $(this.schema).onChange(() => {
      this.setData("x", this.schema.x);
      this.setData("y", this.schema.y);
      this.setData("z", this.schema.z);
      this.setData("xVelocity", this.schema.xVelocity);
      this.setData("yVelocity", this.schema.yVelocity);
      this.setData("zVelocity", this.schema.zVelocity);

      this.setData("direction", this.schema.direction);
      this.setData("tick", this.schema.tick);
      this.setData("state", this.schema.state);
      this.setData("HP", this.schema.HP);

      if (this.isMainPlayer) {
        const data: Partial<PlayerUIData> = {
          maxHp: this.schema.finalStats.HP,
          hp: this.schema.HP,
          x: this.schema.x,
          y: this.schema.y,
          z: this.schema.z,
        };
        eventBus.emit("update-self-ui", data);

        eventBus.emit("update-feats", this.schema.feats);
        eventBus.emit("update-status-effects", this.schema.statusEffects);
      }
    });

    this.x = schema.x;
    this.y = schema.y;
    this.HP = schema.HP;

    this.scene = scene;
    this.state = "walk";

    this.username = schema.username;

    this.width = 48;
    this.height = 48;

    this.initPlayerAppearance().then(() => {
      this.setState("idle");
      this.setDirection("right", true);
    });
    this.scene.add.existing(this);

    this.usernameText = this.scene.add.text(0, -20, this.username, {
      fontSize: "10px",
      color: "#ffffff",
      backgroundColor: "#000000AA",
    });
    this.usernameText.setOrigin(0.5, 1);
    this.usernameText.setPadding(1);

    this.add(this.usernameText);

    this.showUsernameText(this.scene.playerController.showNameTags);

    this.shadow = this.scene.add.ellipse(schema.x, schema.y - 3, 10, 7, 0x000000, 0.8);

    this.shadow.depth = this.y - 32;
    this.depth = this.y + this.height / -2;
  }

  getComponent(name: keyof PlayerComponents): PlayerComponent | undefined {
    return this.components[name];
  }

  setComponent(name: keyof PlayerComponents, component: PlayerComponent) {
    if (this.components[name]) this.components[name].destroy();

    this.components[name] = component;
    component.initialize(this);
    this.add(component);
  }

  getAllComponents(): PlayerComponent[] {
    return Object.values(this.components).filter(
      (comp): comp is PlayerComponent => comp !== undefined
    );
  }

  removeAllComponents() {
    this.getAllComponents().forEach((c) => {
      delete this.components[c.category];
      c.destroy();
    });
  }

  play(key: string) {
    this.getAllComponents().forEach((c) => c.play(key, true));
  }

  setDirection(
    direction: "up" | "down" | "left" | "right",
    force: boolean = false
  ) {
    if (this.direction == direction && !force) return;

    this.direction = direction;

    this.sortChildren();
    this.play(this.state);
  }

  setState(state: string | number, force: boolean = false): this {
    if (this.state === state && !force) return this;

    super.setState(state);
    this.play(this.state);
    return this;
  }

  showUsernameText(visible: boolean) {
    this.usernameText.setVisible(visible);
  }

  update() {
    if (!this.data) {
      return;
    }

    const {
      x,
      y,
      z,
      xVelocity,
      yVelocity,
      zVelocity,
      state,
      tick,
      direction,
      HP,
    } = this.data.values;

    const netSpeed = Math.abs(xVelocity) + Math.abs(yVelocity);

    let dx = x - this.x;
    let dy = y - this.y - z;
    if (Math.abs(dx) < 0.1) dx = 0;
    if (Math.abs(dy) < 0.1) dy = 0;

    if (this.direction != direction) this.setDirection(direction);

    this.x = Phaser.Math.Linear(this.x, x, 0.6);
    this.y = Phaser.Math.Linear(this.y, y - z, 0.6);

    this.shadow.x = Phaser.Math.Linear(this.shadow.x, x, 0.6);
    this.shadow.y = Phaser.Math.Linear(this.shadow.y, y - 3, 0.6);
    this.depth = this.y + this.height / -2;
    this.shadow.depth = this.depth - 1;

    if (
      netSpeed > 25 &&
      this.state !== "attack" &&
      this.state !== "bow" &&
      this.state !== "wand"
    )
      this.setState("walk");

    if (state === "attack" && tick > this.lastAttackTick) {
      if (
        this.schema.appearance.get("weapon")?.includes("bow") ||
        this.schema.appearance.get("weapon")?.includes("wand")
      )
        this.setState("bow", true);
      else this.setState("attack", true);
      this.getComponent("head")?.on("animationcomplete", () => {
        this.setState("idle");
      });
      this.lastAttackTick = tick;
    }

    if (this.state === "jumpFalling" && state !== "jump") {
      this.setState("idle");
    }
    if (state === "jump") {
      if (zVelocity > 50) this.setState("jumpRising");
      else if (zVelocity < -50) this.setState("jumpFalling");
      else this.setState("jumpBalanced");
    }

    if (dx === 0 && dy === 0 && this.state === "walk") {
      if (netSpeed < 25) this.setState("idle");
    }

    if (this.HP > HP) {
      this.HP = HP;
      const tintColor = 0x660000;
      for (const component of this.getAllComponents()) {
        component.setTint(tintColor);

        this.scene.time.delayedCall(200, () => {
          component.clearTint();
        });
      }
    } else if (this.HP < HP) {
      this.HP = HP;
    }
  }

  fixedUpdate() {}

  async initPlayerAppearance() {
    this.removeAllComponents();

    if (!this.schema.appearance) return;

    for (const key of categories) {
      const schemaComponent = this.schema.appearance.get(key);

      if (schemaComponent) {
        const comp: PlayerComponent =
          await this.scene.playerComponentFactory.create(schemaComponent, key);

        this.setComponent(key, comp);
      }
    }

    this.direction = "up";
    this.setDirection("down");
  }

  sortChildren() {
    for (const key of Object.keys(this.components) as Array<
      keyof PlayerComponents
    >) {
      const comp = this.components[key];
      if (comp) {
        comp.depth = this.componetsDepthIndex[key][this.direction];
      }
    }

    this.list.sort((a, b) => {
      const x = a as PlayerComponent;
      const y = b as PlayerComponent;

      return x.depth - y.depth;
    });
  }

  destroy(fromScene?: boolean): void {
    this.shadow.destroy();

    super.destroy(fromScene);
  }
}
