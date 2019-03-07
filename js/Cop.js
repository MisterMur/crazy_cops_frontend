class Cop extends Entity {
  constructor(scene,x,y) {
    super(scene, x, y, "cop", "Coppy");
    this.play("cop")
    this.body.velocity.y = Phaser.Math.Between(50, 100);
    // debugger
    // if(this.active===true){

      //shoot on timer
      this.shootTimer = this.scene.time.addEvent({
        delay: 1000,
        callback: function() {
          var laser = new CopLaser(
            this.scene,
            this.x,
            this.y
          );
          laser.setScale(this.scaleX);
          this.scene.copLasers.add(laser);
        },
        callbackScope: this,
        loop: true
      });
      // debugger

  };




  // stopShooting() {
  //   this.shootTimer.paused = false;
  // };
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

  onDestroy() {
    if (this.shootTimer !== undefined) {
      if (this.shootTimer) {
        this.shootTimer.remove(false);
      }
    }
  }
}//end of cop class

class CopLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserEnemy0");
    this.body.velocity.y = 200;
  }


}
