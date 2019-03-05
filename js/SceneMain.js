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
    this.load.spritesheet("sprEnemy2", "content/cop.png", {
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
      frames: this.anims.generateFrameNumbers("sprEnemy2"),
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
    this.copLasers = this.add.group();
    this.carLasers = this.add.group();

    // recognize collision between game objects
    this.physics.add.collider(this.carLasers, this.enemies, function(carLaser, enemy) {
      // destroys cop
      if (enemy) {
        if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
        }
        // enemy.getData('isDead')
      enemy.explode(true);
      carLaser.destroy();
    }
  });
  // recognize collison between cop and car
    this.physics.add.overlap(this.car, this.enemies, function(car, enemy) {
      if (!car.getData("isDead") &&
          !enemy.getData("isDead")) {
            car.explode(false);
            enemy.explode(true);
            car.onDestroy()
        }
    });

    // recognize collion between car and laser
    this.physics.add.overlap(this.car, this.copLasers, function(car, laser) {
      if (!car.getData("isDead") &&
        !laser.getData("isDead")) {
          car.explode(false);
          laser.destroy();
          car.onDestroy()
        }
    });

    //spawn enemies based on time event
    this.time.addEvent({
    delay: 1500,
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
    if (!this.car.getData("isDead")) {
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

      if (this.keySpace.isDown) {
        this.car.setData("isShooting", true);
      }

      else {
        this.car.setData("timerShootTick", this.car.getData("timerShootDelay") - 1);
        this.car.setData("isShooting", false);
      }

      // delete cops once they leave the screen
      for (var i = 0; i < this.enemies.getChildren().length; i++) {
        var enemy = this.enemies.getChildren()[i];
        enemy.update();

        if (enemy.x < -enemy.displayWidth ||
          enemy.x > this.game.config.width + enemy.displayWidth ||
          enemy.y < -enemy.displayHeight * 4 ||
          enemy.y > this.game.config.height + enemy.displayHeight) {
          if (enemy) {
            if (enemy.onDestroy !== undefined) {
              enemy.onDestroy();
            }
          enemy.destroy();
        }
      }
    }

    // delete copLasers that are no longer on screen
    for (var i = 0; i < this.copLasers.getChildren().length; i++) {
      var laser = this.copLasers.getChildren()[i];
      laser.update();

      if (laser.x < -laser.displayWidth ||
      laser.x > this.game.config.width + laser.displayWidth ||
      laser.y < -laser.displayHeight * 4 ||
      laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    //delete carLasers that are no longer on screen
    for (var i = 0; i < this.carLasers.getChildren().length; i++) {
      var laser = this.carLasers.getChildren()[i];
      laser.update();

      if (laser.x < -laser.displayWidth ||
      laser.x > this.game.config.width + laser.displayWidth ||
      laser.y < -laser.displayHeight * 4 ||
      laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }
  }
}; // end of update

}
