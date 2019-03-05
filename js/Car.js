class Car extends Entity{
  constructor(scene,x,y,key){
    super(scene,x,y,"porsche")

    this.setData("isShooting", false);
    this.setData("timerShootDelay", 10);
    this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
    this.setData("speed", 200);
  }
  moveUp() {
    this.body.velocity.y = -this.getData("speed");
  }
  moveDown() {
    this.body.velocity.y = this.getData("speed");
  }
  moveLeft() {
    this.body.velocity.x = -this.getData("speed");
  }
  moveRight() {
    this.body.velocity.x = this.getData("speed");
  }
  update(){
    this.body.setVelocity(0, 0);
    this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
    this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);

    if (this.getData("isShooting")) {
      if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
        this.setData("timerShootTick", this.getData("timerShootTick") + 1); // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
      }
      else { // when the "manual timer" is triggered:
        var laser = new CarLaser(this.scene, this.x, this.y);
        this.scene.carLasers.add(laser);

        this.scene.sfx.laser.play(); // play the laser sound effect
        this.setData("timerShootTick", 0);
      }
    }
  }

  explode(canDestroy)
  {
    if (!this.getData("isDead")) {
  // Set the texture to the explosion image, then play the animation
    this.setTexture("sprExplosion");  // this refers to the same animation key we used when we added this.anims.create previously
    this.play("sprExplosion"); // play the animation
  // pick a random explosion sound within the array we defined in this.sfx in SceneMain
    this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)].play();
      if (this.shootTimer !== undefined) {
      if (this.shootTimer) {
        this.shootTimer.remove(false);
      }
    }
    this.setAngle(0);
    this.body.setVelocity(0, 0);
    this.on('animationcomplete', function() {
      if (canDestroy) {
        this.destroy();
    }
    else {
      this.setVisible(false);
    }
    }, this);
    this.setData("isDead", true);
    }
  }
} // end of car class

class CarLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserPlayer");
    this.body.velocity.y = -200;
  }
}

class Speedy extends Car {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy1", "Speedy");

  }
}//end of speedy class
class Tanky extends Car {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy0", "Tanky");
    this.play("sprEnemy0");
  }
}//end of tanky class
class Shooty extends Car {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy2", "Shooty");
    this.play("sprEnemy2");
  }
}//end of shooty class
