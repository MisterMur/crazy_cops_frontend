class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
  }

  preload() {
    this.load.image("sprBtnPlay", "content/sprBtnPlay.png");
    this.load.image("cop", "content/cop.png");
    this.load.image("porsche", "content/porsche.png");
    this.load.image("sprBtnPlayHover", "content/sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "content/sprBtnPlayDown.png");
    this.load.image("sprBtnRestart", "content/sprBtnRestart.png");
    this.load.image("sprBtnRestartHover", "content/sprBtnRestartHover.png");
    this.load.image("sprBtnRestartDown", "content/sprBtnRestartDown.png");
    this.load.audio("sndBtnOver", "content/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "content/sndBtnDown.wav");
  }

  create() {
    this.scene.start("SceneMain");

  //   this.title = this.add.text(this.game.config.width * 0.5, 128, "SUPPPPP", {
  //     fontFamily: 'monospace',
  //     fontSize: 48,
  //     fontStyle: 'bold',
  //     color: '#ffffff',
  //     align: 'center'
  //   });
  //   this.title.setOrigin(0.5);
  // }
  }
}
