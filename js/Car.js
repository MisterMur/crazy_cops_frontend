class Car extends Entity{
  constructor(scene,x,y,key){
    super(scene,x,y,"sprPlayer")

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
  }
} // end of car class
class Speedy extends Car {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy1", "Speedy");
  }
}
class Tanky extends Car {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy0", "Tanky");
    this.play("sprEnemy0");
  }
}
class Shooty extends Car {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy2", "Shooty");
    this.play("sprEnemy2");
  }
}
