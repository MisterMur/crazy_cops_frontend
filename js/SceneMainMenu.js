const url = 'http://localhost:3000/api/v1/'
var allCars = [];
var allUsers = [];
var currentUser;

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
    // this.loadSceneMain=this.loadSceneMain().bind(this)
  };

  preload() {
    this.load.image("sprBtnPlay", "content/sprBtnPlay.png");
    this.load.image("cop", "content/cop.png");
    this.load.image("porsche", "content/porsche.png");
    this.load.image("tank", "content/tank.png");
    this.load.image("sprBtnPlayHover", "content/sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "content/sprBtnPlayDown.png");
    this.load.image("sprBtnRestart", "content/sprBtnRestart.png");
    this.load.image("sprBtnRestartHover", "content/sprBtnRestartHover.png");
    this.load.image("sprBtnRestartDown", "content/sprBtnRestartDown.png");
    this.load.audio("sndBtnOver", "content/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "content/sndBtnDown.wav");
  };

  create() {
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown")
    };
    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprBtnPlay"
    );
    this.btnPlay.setInteractive();
    this.btnPlay.on("pointerover", function() {
      this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover

      this.sfx.btnOver.play(); // play the button over sound
    }, this);
    this.btnPlay.on("pointerout", function() {
      this.setTexture("sprBtnPlay");
      });
    this.btnPlay.on("pointerdown", function() {
      this.btnPlay.setTexture("sprBtnPlayDown");
      this.sfx.btnDown.play();
    }, this);
    this.btnPlay.on("pointerup", function() {
      this.btnPlay.setTexture("sprBtnPlay");
      this.scene.start("SceneMain");
    }, this);
  };//end of create

  loadSceneMain(){
    this.scene.start("SceneMain")
  }
};// end of SceneMainMenu class

function addMainMenuElements(){
  const userContainer=document.querySelector('#user-container')
  userContainer.innerHTML +=`
  <form id="user-form" action="index.html" method="post">
    <input type="text" label="Username" name="username" value="">
    <input type="submit" value="Create User">
  </form>
  `
};//end of addMainMenuElements

function addCarMenuElements(){
  const userContainer=document.querySelector('#user-container')
  userContainer.innerHTML +=`
  <form id="car-form" action="index.html" method="post">
    <select label="Choose a car" name="car">
      <option value="speedy">Speedy</option>
      <option value="shooty">Shooty</option>
      <option value="tanky">Tanky</option>
    <input type="submit" value="Select Car">
  </form>
  `
};

document.addEventListener('submit', function(e){
  const userForm = document.querySelector('#user-form')
  const carForm = document.querySelector('#car-form')
  if (e.target === userForm){
    e.preventDefault();
    // getAllusers();
    if(searchExistingUser(userForm.username.value) == undefined) {
      addNewUser({username: userForm.username.value});
      currentUser = searchExistingUser(userForm.username.value);
      console.log(currentUser)
    } else {
      currentUser = searchExistingUser(userForm.username.value);
    }
    //current user is undefined here if they're a new user, unless you click the submit button (twice?)
    game.user = currentUser;
  } else if (e.target === carForm) {
    e.preventDefault();
    if (e.target.car.value == "speedy") {
      game.car = allCars[0];
    } else if (e.target.car.value == "tanky") {
      game.car = allCars[1];
    } else if (e.target.car.value == "shooty") {
      game.car = allCars[2];
    }
  }
})

document.addEventListener('DOMContentLoaded',function(){
  addMainMenuElements()
  addCarMenuElements()
  getAllusers()
  getCars()
})

function getCars() {
  fetch(url+'cars')
  .then(res=>res.json())
  .then(cars=>{
    allCars = [];
    cars.forEach(car=>{
      allCars.push(car);
    })
  })
};

function searchExistingUser(name){
  getAllusers();

  return allUsers.find(u => {
    // debugger
    return u.username == name;
  });
  debugger
  // console.log(foundUser)
}

function getAllusers(){
  fetch(url+'users')
  .then(res=>res.json())
  .then(users => {
    allUsers = [];
    users.forEach(user => {
      allUsers.push(user);
    })
  })
}

function addNewUser(user){
  fetch(url+'users',{
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type":'application/json',
      "Accepts":'application/json'
    },
    body: JSON.stringify({
      username: user.username
    })
  }).then(myJson =>
    myJson.json())
  .then(
    res=>{allUsers.push(res)
    return res
  })
}
