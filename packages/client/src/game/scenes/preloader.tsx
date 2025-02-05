export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.spritesheet("arrow", "assets/spritesheets/misc/arrow.png", {frameWidth: 16, frameHeight: 16})
  }

  create() {
    this.scene.start("main");
  }
}
