class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
  }// end of constructor

  preload() {
    this.load.image("sprBg0", "content/sprBg0.png");
    this.load.image("sprBg1", "content/sprBg1.png");
    this.load.spritesheet("sprExplosion", "content/sprExplosion.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("sprEnemy0", "content/sprEnemy0.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("sprEnemy1", "content/sprEnemy1.png");
    this.load.spritesheet("cop", "content/cop.png", {
      frameWidth: 30,
      frameHeight: 45
    });
    this.load.image("sprLaserEnemy0", "content/sprLaserEnemy0.png");
    this.load.image("sprLaserPlayer", "content/sprLaserPlayer.png");
    this.load.spritesheet("sprPlayer", "content/sprPlayer.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.audio("sndExplode0", "content/sndExplode0.wav");
    this.load.audio("sndExplode1", "content/sndExplode1.wav");
    this.load.audio("sndLaser", "content/sndLaser.wav");

  };//end of preload

  create() {
    this.anims.create({
      key: "sprEnemy0",
      frames: this.anims.generateFrameNumbers("sprEnemy0"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "cop",
      frames: this.anims.generateFrameNumbers("cop"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "sprExplosion",
      frames: this.anims.generateFrameNumbers("sprExplosion"),
      frameRate: 20,
      repeat: 0
    });
    this.anims.create({
      key: "sprPlayer",
      frames: this.anims.generateFrameNumbers("sprPlayer"),
      frameRate: 20,
      repeat: -1
    });

    this.sfx = {
        explosions: [
          this.sound.add("sndExplode0"),
          this.sound.add("sndExplode1")
        ],
        laser: this.sound.add("sndLaser")
    };

    this.car = new Car(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprPlayer"
    );
    //assigns movement to keys
    this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //group enemies and shots
    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    //spawn enemies based on time event
    this.time.addEvent({
    delay: 100,
    callback: function() {
    var enemy = new Cop(
      this,
      Phaser.Math.Between(0, this.game.config.width),
      0
    );
    this.enemies.add(enemy);
    },
    callbackScope: this,
    loop: true
    });
  }; // end of create

  update(){
    this.car.update();
    if (this.keyUp.isDown) {
      this.car.moveUp();
    }
    else if (this.keyDown.isDown) {
      this.car.moveDown();
    }
    if (this.keyLeft.isDown) {
      this.car.moveLeft();
    }
    else if (this.keyRight.isDown) {
      this.car.moveRight();
    }
  }; // end of update

}
