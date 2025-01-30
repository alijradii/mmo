export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {}

  create() {
    this.scene.start("main");
  }
}
