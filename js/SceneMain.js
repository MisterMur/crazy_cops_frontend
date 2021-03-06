class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
  }// end of constructor

  preload() {
    this.load.image("sprBg0", contentUrl+"sprBg0.png");
    this.load.image("sprBg1", contentUrl+"sprBg1.png");
    this.load.spritesheet("sprExplosion", contentUrl+"sprExplosion.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("sprEnemy0", contentUrl+"sprEnemy0.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("sprEnemy1", contentUrl+"sprEnemy1.png");
    this.load.spritesheet("sprEnemy2", contentUrl+"cop.png", {
      frameWidth: 30,
      frameHeight: 45
    });
    this.load.image("sprLaserEnemy0", contentUrl+"sprLaserEnemy0.png");
    this.load.image("sprLaserPlayer", contentUrl+"sprLaserPlayer.png");
    this.load.spritesheet("sprPlayer", contentUrl+"sprPlayer.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.audio("sndExplode0", contentUrl+"sndExplode0.wav");
    this.load.audio("sndExplode1", contentUrl+"sndExplode1.wav");
    this.load.audio("sndLaser", contentUrl+"sndLaser.wav");

    this.i = 0;
    this.level = 1;
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

    // assign this.car based on user input
    if (game.car.category == "Speedy") {
      this.car = new Speedy(
        this,
        this.game.config.width * 0.5,
        this.game.config.height * 0.5,
        "sprPlayer"
      )} else if (game.car.category == "Shooty") {
        this.car = new Shooty(
          this,
          this.game.config.width * 0.5,
          this.game.config.height * 0.5,
          "sprPlayer"
        )
      } else if (game.car.category == "Tanky") {
        this.car = new Tanky(
          this,
          this.game.config.width * 0.5,
          this.game.config.height * 0.5,
          "sprPlayer"
        )
      }

    game.carPoints = 0;

    game.currentPoints = this.add.text(60, 15, 0 +' Points', { fill: '#ffffff', fontFamily: 'monospace',fontSize:14, align:'left' });
    game.currentPoints.setOrigin(0.5);

    game.currentHealth = this.add.text(this.game.config.width - 35, 15, this.car.getData('health') + ' HP', { fill: '#ffffff', fontFamily: 'monospace',fontSize:14, align:'right'});
    game.currentHealth.setOrigin(0.5);

    game.level = this.add.text(this.game.config.width * 0.5, 15, 'Level ' + this.level, { fill: '#ffffff', fontFamily: 'monospace',fontSize:14, align:'center'});
    game.level.setOrigin(0.5);
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
      if (enemy && !enemy.getData('isDead')) {
        if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
        }
        // enemy.getData('isDead')
        enemy.explode(true);
        carLaser.destroy();
        game.carPoints += 100;
        game.currentPoints.setText(game.carPoints + ' Points');
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
      let carHealth = car.getData("health");
      if (!laser.getData("isDead")) {
        laser.destroy();
      }
      carHealth -= 50;

      car.setData("health", carHealth);
      game.currentHealth.setText(carHealth + ' HP');
      if (carHealth == 0) {
        if (!car.getData("isDead")) {
            car.explode(false);
            laser.destroy();
            car.onDestroy()
          }
        }
    });

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

  };

  update() {

    if (!this.car.getData("isDead")) {
      if (this.i !==0 && this.i % 1000 == 0) {
        this.level++;
        game.level.setText('Level ' + this.level)
       let numCops = 0
         this.time.addEvent({
         delay: 2000,
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
       }
      this.i++;
     }

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
