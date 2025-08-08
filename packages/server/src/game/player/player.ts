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
import { IAncestry } from "../../database/models/ancestry.model";
import { IClass } from "../../database/models/class.model";
import { Inventory } from "../items/inventory";
import { InventoryItem } from "../items/inventoryItem";
import { IWeapon } from "../../database/models/weapon.model";
import { RangedAttack } from "../modules/attackModule/rangedAttack";
import { PlayerJumpState } from "./states/playerJumpState";
import { featFactory } from "../modules/feats/featFactory";
import { GameItem } from "../core/gameItem";

export class Player extends Entity {
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

  public baseAppearance!: IPlayer["appearance"];

  public skipSave: boolean = false;
  public lastInteractTick: number = 0;

  constructor(world: GameRoom, playerDocument: IPlayer) {
    super(world);

    this.width = 0;
    this.height = 16;

    this.party = 1;
    this.HP = 100;

    this.idleState = new IdleState(this);
    this.attackState = new AttackState(this);

    this.setState(this.idleState);

    this.initDocument(playerDocument);
    this.initInventory(playerDocument);

    this.initFeats();
  }

  initAttack() {
    const weapon: IWeapon | undefined = dataStore.weapons.get(
      this.inventory.equipment.get("weapon")?.id || ""
    );

    if (!weapon) {
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
    this.party = playerDocument.party;

    this.baseAppearance = playerDocument.appearance;

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

  initFeats() {
    const feats = featFactory(this);

    for (const feat of feats) this.feats.push(feat);
  }

  calculateBaseStats() {}

  calculateSecondaryStats() {
    if (!this.iclass) {
      this.finalStats.SPEED = 200;
      return;
    }

    this.finalStats.SPEED = Math.floor((210 * this.iclass.speed) / 100);
    this.finalStats.HP =
      this.iclass.hitpoints +
      (this.iclass.hitpoints / 5) * (this.finalStats.CON + this.LEVEL - 11);
  }

  update() {
    super.update();
    this.getState().update();
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
    this.x = this.world.mapInfo.data?.spawnPoint.x || 0;
    this.y = this.world.mapInfo.data?.spawnPoint.y || 0;
    console.log(this.x, this.y)
    this.xVelocity = 0;
    this.yVelocity = 0;

    this.HP = this.finalStats.HP;

    console.log(this.username, " was killed!!!");
  }

  getMaxSpeed(): number {
    return this.finalStats.SPEED;
  }

  async savePost() {
    if(this.skipSave) return;

    const updatedData: Partial<IPlayer> = {
      x: Math.floor(this.x),
      y: Math.floor(this.y),
      map: this.world.roomName,
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

    if (key === "inventory-drop" && validateSource) {
      const item = this.inventory.items.get(`${message.source}`);

      if (!item) return;

      const gameItem = new GameItem(this.world, item);
      gameItem.x = this.x;
      gameItem.y = this.y;

      gameItem.yVelocity = 50;

      this.world.spawnObject(gameItem);
      this.inventory.items.delete(`${message.source}`);
      this.inventory.setDirty("items");
    }
  }

  pickUpItem(item: InventoryItem): boolean {
    for (let i = 0; i < this.inventory.cols * this.inventory.rows; i++) {
      const row = i / this.inventory.cols;
      const col = i % this.inventory.cols;
      if (this.inventory.getItem(row, col)) {
        continue;
      }

      const invItem: InventoryItem = new InventoryItem(item.id, item.quantity);

      this.inventory.setItem(row, col, invItem);
      this.inventory.setDirty("items");
      return true;
    }
    return false;
  }
}
