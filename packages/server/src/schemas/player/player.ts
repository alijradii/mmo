import { GameRoom } from "../../rooms/gameRoom";
import { Entity } from "../entities/entity";
import { MapSchema, type, view } from "@colyseus/schema";
import { PlayerInput } from "../playerInput";
import { IdleState } from "./states/playerIdleState";
import { State } from "../entities/genericStates/state";
import { AttackState } from "./states/playerAttackState";
import { Rectangle } from "../../utils/hitboxes";
import { Attack } from "../modules/attackModule/attack";
import { MeleeAttack } from "../modules/attackModule/meleeAttack";
import { IPlayer, PlayerModel } from "../../database/models/player.model";
import { RangedAttack } from "../modules/attackModule/rangedAttack";
import { dataStore, WeaponStatBlock } from "../../data/dataStore";
import { GiantLeapFeat } from "../modules/feats/classes/barbarian/giantLeap";
import { DashFeat } from "../modules/feats/generic/dash";
import { IAncestry } from "../../database/models/ancestry.model";
import { IClass } from "../../database/models/class.model";
import { Inventory } from "../items/inventory";
import { InventoryItem } from "../items/inventoryItem";

export class Player extends Entity {
  @type("number")
  tick: number = 0;

  @type("string")
  username: string = "";

  @type("string")
  frontextra = "";

  @type("string")
  hair = "";

  @type("string")
  backhair = "";

  @type("string")
  head = "";

  @type("string")
  hat = "";

  @type("string")
  top = "";

  @type("string")
  bottom = "";

  @type("string")
  backextra = "";

  @type("string")
  weapon = "";

  @view()
  @type(Inventory)
  inventory = new Inventory();

  colliderWidth = 18;
  colliderHeight = 26;

  hitBoxWidth: number = 32;
  hitBoxHeight: number = 32;

  public attackState: State;
  public inputQueue: PlayerInput[] = [];
  public weaponStats!: WeaponStatBlock;

  public iclass!: IClass;
  public ancestry!: IAncestry;

  autoAttack: Attack = new Attack(this);

  constructor(world: GameRoom, playerDocument: IPlayer) {
    super(world);
    this.HP = 100;

    this.idleState = new IdleState(this);
    this.attackState = new AttackState(this);

    this.setState(this.idleState);

    this.initDocument(playerDocument);
    this.initInventory(playerDocument);

    this.initAttack();

    this.width = 0;
    this.height = 16;

    this.feats.push(new GiantLeapFeat(this));
    this.feats.push(new DashFeat(this));
  }

  initAttack() {
    const weapon = dataStore.weapons.get(this.weapon);
    if (!weapon) {
      this.autoAttack = new MeleeAttack(this);
      this.autoAttack.damage = 10;
      this.autoAttack.cooldown = 14;
      this.autoAttack.knockback = 20;
      this.autoAttack.duration = 14;
      return;
    }
    this.weaponStats = weapon;

    if (weapon.type === "ranged") {
      this.autoAttack = new RangedAttack(this, weapon);
    } else {
      this.autoAttack = new MeleeAttack(this, weapon);
    }
  }

  initDocument(playerDocument: IPlayer) {
    if (!playerDocument._id) {
      throw new Error("Tried to create a player with no id");
    }

    this.id = playerDocument._id;
    this.username = playerDocument.username;
    this.hat = playerDocument.appearance.hat || "";
    this.frontextra = playerDocument.appearance.frontextra || "";
    this.head = playerDocument.appearance.head || "";
    this.hair = playerDocument.appearance.hair || "";
    this.backhair = playerDocument.appearance.backhair || "";
    this.top = playerDocument.appearance.top || "";
    this.bottom = playerDocument.appearance.bottom || "";
    this.backextra = playerDocument.appearance.backextra || "";
    this.weapon = playerDocument.appearance.weapon || "";

    this.baseStats.HP = 100;
    this.baseStats.STR = playerDocument.STR;
    this.baseStats.DEX = playerDocument.DEX;
    this.baseStats.INT = playerDocument.INT;
    this.baseStats.CON = playerDocument.CON;
    this.baseStats.CHA = playerDocument.CHA;
    this.baseStats.WIS = playerDocument.WIS;

    this.x = playerDocument.x;
    this.y = playerDocument.y;
  }

  initInventory(playerDocument: IPlayer) {
    this.inventory = new Inventory();

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

    this.inventory.setDirty("items");
  }

  calculateBaseStats() {}

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

  kill() {
    this.x = 0;
    this.y = 0;
    this.xVelocity = 0;
    this.yVelocity = 0;

    this.HP = this.baseStats.HP;

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
