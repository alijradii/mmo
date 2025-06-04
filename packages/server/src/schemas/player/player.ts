import { GameRoom } from "../../rooms/gameRoom";
import { Entity } from "../entities/entity";
import { type, view } from "@colyseus/schema";
import { PlayerInput } from "../playerInput";
import { IdleState } from "./states/playerIdleState";
import { State } from "../entities/genericStates/state";
import { AttackState } from "./states/playerAttackState";
import { Rectangle } from "../../utils/hitboxes";
import { MeleeAttack } from "../modules/attackModule/meleeAttack";
import {
  IPlayer,
  PlayerModel,
  SLOTS,
} from "../../database/models/player.model";
import { dataStore } from "../../data/dataStore";
import { GiantLeapFeat } from "../modules/feats/classes/barbarian/giantLeap";
import { DashFeat } from "../modules/feats/generic/dash";
import { IAncestry } from "../../database/models/ancestry.model";
import { IClass } from "../../database/models/class.model";
import { Inventory } from "../items/inventory";
import { InventoryItem } from "../items/inventoryItem";
import { IWeapon } from "../../database/models/weapon.model";
import { RangedAttack } from "../modules/attackModule/rangedAttack";
import { PlayerJumpState } from "./states/playerJumpState";

export class Player extends Entity {
  @type("number")
  tick: number = 0;

  @type("string")
  username: string = "";

  @view()
  @type(Inventory)
  inventory = new Inventory(this);

  colliderWidth = 18;
  colliderHeight = 26;

  hitBoxWidth: number = 32;
  hitBoxHeight: number = 32;

  public attackState: State;
  public inputQueue: PlayerInput[] = [];

  public iclass!: IClass;
  public ancestry!: IAncestry;

  constructor(world: GameRoom, playerDocument: IPlayer) {
    super(world);
    this.HP = 100;

    this.idleState = new IdleState(this);
    this.attackState = new AttackState(this);

    this.setState(this.idleState);

    this.initDocument(playerDocument);
    this.initInventory(playerDocument);

    this.width = 0;
    this.height = 16;

    this.feats.push(new GiantLeapFeat(this));
    this.feats.push(new DashFeat(this));
  }

  initAttack() {
    const weapon: IWeapon | undefined = dataStore.weapons.get(
      this.appearance.get("weapon") || ""
    );

    if (!weapon) {
      this.autoAttack = new MeleeAttack(this);
      return;
    }

    if (!weapon.ranged) this.autoAttack = new MeleeAttack(this, weapon);
    else this.autoAttack = new RangedAttack(this, weapon);
  }

  initDocument(playerDocument: IPlayer) {
    if (!playerDocument._id) {
      throw new Error("Tried to create a player with no id");
    }

    this.id = playerDocument._id;
    this.username = playerDocument.username;

    const appearanceItems = [
      "hat",
      "frontextra",
      "head",
      "backhair",
      "hair",
      "top",
      "bottom",
      "backextra",
    ];
    appearanceItems.forEach((item) => {
      if (playerDocument.appearance[item as keyof IPlayer["appearance"]]) {
        console.log(item);
        this.appearance.set(
          item,
          playerDocument.appearance[item as keyof IPlayer["appearance"]]
        );
      }
    });

    this.LEVEL = playerDocument.level;

    const cl = dataStore.classes.get(playerDocument.class);
    if (cl) this.iclass = cl;

    this.baseStats.STR = playerDocument.STR;
    this.baseStats.DEX = playerDocument.DEX;
    this.baseStats.INT = playerDocument.INT;
    this.baseStats.CON = playerDocument.CON;
    this.baseStats.CHA = playerDocument.CHA;
    this.baseStats.WIS = playerDocument.WIS;

    this.resetFinalStats();
    this.calculateBaseStats();
    this.calculateSecondaryStats();

    this.HP = this.finalStats.HP;
    this.maxSpeed = 150;
    console.log(this.maxSpeed);

    this.x = playerDocument.x;
    this.y = playerDocument.y;
  }

  initInventory(playerDocument: IPlayer) {
    this.inventory = new Inventory(this);

    for (let r = 0; r < this.inventory.rows; r++) {
      for (let c = 0; c < this.inventory.cols; c++) {
        const dbItem =
          playerDocument.inventoryGrid[r * this.inventory.cols + c];

        if (!dbItem || !dbItem.itemId) continue;

        if (!dataStore.items.get(dbItem.itemId)) {
          throw new Error(`Item id not found:  ${dbItem.itemId}`);
        }

        const item: InventoryItem = new InventoryItem(
          dbItem.itemId,
          dbItem.quantity
        );
        this.inventory.setItem(r, c, item);
      }
    }

    SLOTS.forEach((slot) => {
      if (playerDocument.gear?.[slot]?.itemId) {
        this.inventory.setEquipment(
          new InventoryItem(playerDocument.gear[slot].itemId, 1)
        );
      }
    });

    this.inventory.setDirty("items");
    this.inventory.setDirty("equipment");
  }

  calculateBaseStats() {}

  calculateSecondaryStats() {
    this.finalStats.SPEED = 250;
    this.finalStats.HP =
      this.iclass.hitpoints +
      (this.iclass.hitpoints / 10) * (this.finalStats.CON + this.LEVEL - 11);
  }

  update() {
    this.getState().update();

    for (const feat of this.feats) feat.update();
  }

  getHitBoxRect(): Rectangle {
    let xoffset = 0;
    let yoffset = 0;

    switch (this.direction) {
      case "up":
        [xoffset, yoffset] = [0, -11];
        break;
      case "down":
        [xoffset, yoffset] = [0, 6];
        break;
      case "left":
        [xoffset, yoffset] = [-6, 0];
        break;
      case "right":
        [xoffset, yoffset] = [11, 0];
    }

    return {
      x: this.x - this.hitBoxWidth / 2 + xoffset,
      y: this.y - this.hitBoxHeight / 2 + yoffset,
      width: this.hitBoxWidth,
      height: this.hitBoxHeight,
    };
  }

  clearInupt(): void {
    this.inputQueue.length = 0;
  }

  jump() {
    this.setState(new PlayerJumpState(this));
  }

  kill() {
    this.x = 0;
    this.y = 0;
    this.xVelocity = 0;
    this.yVelocity = 0;

    this.HP = this.finalStats.HP;

    console.log(this.username, " was killed!!!");
  }

  getMaxSpeed(): number {
    return this.statOverrides.maxSpeed || this.maxSpeed;
  }

  async savePost() {
    const updatedData: Partial<IPlayer> = {
      x: Math.floor(this.x),
      y: Math.floor(this.y),
      inventoryGrid: this.inventory.getDatabaseList(),
      gear: this.inventory.getDatabaseEquipment(),
    };

    await PlayerModel.updateOne({ _id: this.id }, updatedData);
  }

  handleInventoryChange(key: string, message: any) {
    const validateSource = !isNaN(message.source);
    const validateDestination = !isNaN(message.destination);

    if (key === "inventory-move" && validateSource && validateDestination) {
      const fromRow = Math.floor(message.source / this.inventory.cols);
      const fromCol = message.source % this.inventory.cols;

      const toRow = Math.floor(message.destination / this.inventory.cols);
      const toCol = message.destination % this.inventory.cols;

      this.inventory.moveItem(fromRow, fromCol, toRow, toCol);
    }

    if (key === "inventory-equip" && validateSource) {
      this.inventory.equipItem(message.source);
    }

    if (
      key === "inventory-unequip" &&
      validateDestination &&
      message.key &&
      ["weapon", "offhand", "helmet", "chest", "legs", "boots"].includes(
        message.key
      )
    ) {
      this.inventory.unequipItem(message.key, message.destination);
    }
  }
}
