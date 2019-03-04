class Cop extends Entity {
  constructor(scene,x,y) {
    super(scene, x, y, "cop", "GunShip");
    this.play("cop")
    this.body.velocity.y = Phaser.Math.Between(50, 100);
  }
}//end of cop class
class CopLasers extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserEnemy0");
    this.body.velocity.y = 200;
  }
}
