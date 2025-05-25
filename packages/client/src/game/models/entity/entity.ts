import { BaseScene } from "@/game/scenes/base";
import { Entity as EntitySchema } from "@backend/schemas/entities/entity";

export class Entity extends Phaser.GameObjects.Container {
  public schema: EntitySchema;

  constructor(scene: BaseScene, schema: EntitySchema) {
    super(scene)

    this.schema = schema;
  }

  fixedUpdate() {}
}