const url = 'https://pure-brushlands-11828.herokuapp.com/api/v1/'
const contentUrl= 'https://s3.us-east-2.amazonaws.com/brianjmurillo.com/Content/'
var allCars = [];
var allUsers = [];
var allUserGames =[]
var currentUser;

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
    // this.loadSceneMain=this.loadSceneMain().bind(this)
  };

  preload() {
    this.load.image("sprBtnPlay", contentUrl+"sprBtnPlay.png");
    this.load.image("donut", contentUrl+"donut.png");
    this.load.image("cop", contentUrl+"cop.png");
    this.load.image("porsche", contentUrl+"porsche.png");
    this.load.image("shooty", contentUrl+"shooty.png");
    this.load.image("tank", contentUrl+"tank.png");
    this.load.image("sprBtnPlayHover", contentUrl+"sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", contentUrl+"sprBtnPlayDown.png");
    this.load.image("sprBtnRestart", contentUrl+"sprBtnRestart.png");
    this.load.image("sprBtnRestartHover", contentUrl+"sprBtnRestartHover.png");
    this.load.image("sprBtnRestartDown", contentUrl+"sprBtnRestartDown.png");
    this.load.audio("sndBtnOver", contentUrl+"sndBtnOver.wav");
    this.load.audio("sndBtnDown", contentUrl+"sndBtnDown.wav");
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
        if(game.user && game.car){
          if(game.error){

            game.error.destroy()
          }
        this.scene.start("SceneMain");
      }else{
        game.error = this.add.text( 115,200,'Please Select Car and User', { fill: '#ffffff', fontFamily: 'monospace',fontSize:16, align:'center' })

      }
      }, this);

  };//end of create

  loadSceneMain(){
    this.scene.start("SceneMain")
  }
};// end of SceneMainMenu class

function addMainMenuElements(){
  const userContainer=document.querySelector('#user-container')
  userContainer.innerHTML +=`
  <div>
    <form class="right" id="user-form" action="index.html" method="post">
      <input type="text" label="Username" name="username" value="">
      <input type="submit" value="Create User">
    </form>
  </div>
  `
};//end of addMainMenuElements

function addCarMenuElements(){
  const userContainer=document.querySelector('#user-container')
  userContainer.innerHTML +=`
  <div>
    <form class="right" id="car-form" action="index.html" method="post">
      <select label="Choose a car" name="car">
        <option value="speedy">Speedy</option>
        <option value="shooty">Shooty</option>
        <option value="tanky">Tanky</option>
      <input type="submit" value="Select Car">
    </form>
  </div>
  `
};

document.addEventListener('submit', function(e){
  const userForm = document.querySelector('#user-form')
  const carForm = document.querySelector('#car-form')
  if (e.target === userForm){
    e.preventDefault();
    if(searchExistingUser(userForm.username.value) == undefined) {
      addNewUser({username: userForm.username.value});
    } else {
      currentUser = searchExistingUser(userForm.username.value);
      game.user = currentUser;
      getAllScores()
    }

    //current user is undefined here if they're a new user, unless you click the submit button (twice?)
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
  return allUsers.find(u => {
    return u.username == name;
  });
}
function getAllScores(){
  fetch(url+`users/${game.user.id}`)
  .then(res=>res.json())
  .then(user => {
    return user.games.sort((a, b) => {
      return b.score - a.score;
    })
  })
  .then(games => {
    for(let i = 0;i<10;i++){
      renderScoreToDom(games[i])
    }
  })
}

function renderScoreToDom(g){
  const scoreContainer = document.querySelector('#score-container')
  scoreContainer.style.display = 'block';
  let splitDate = g.created_at.split('T')
  let formattedDate = splitDate[0] + ' at ' + splitDate[1].slice(0, 5)

  scoreContainer.innerHTML += `
  <div>

    <p>${g.score} Points --> ${formattedDate}</p>
  </div>
  `
}

function getAllusers(){
  fetch(url+'users')
  .then(res=>res.json())
  .then(users => {
    allUsers = [];
    users.forEach(user => {
      allUsers.push(user);
      return allUsers;
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
    res=>{allUsers.push(res);
    game.user = res;
  })
}
