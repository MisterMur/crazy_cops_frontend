var allGames = []

class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: "SceneGameOver" });
  }
  preload() {
    this.load.image("sprBtnPlay", "content/sprBtnPlay.png");
    this.load.image("cop", "content/cop.png");
    this.load.image("shooty", "content/shooty.png");
    this.load.image("porsche", "content/porsche.png");
    this.load.image("donut", "content/donut.png");
    this.load.image("sprBtnPlayHover", "content/sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "content/sprBtnPlayDown.png");
    this.load.image("sprBtnRestart", "content/sprBtnRestart.png");
    this.load.image("sprBtnRestartHover", "content/sprBtnRestartHover.png");
    this.load.image("sprBtnRestartDown", "content/sprBtnRestartDown.png");
    this.load.audio("sndBtnOver", "content/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "content/sndBtnDown.wav");
  };
  create() {
    this.title = this.add.text(this.game.config.width * 0.5, 128, "GAME OVER", {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.title.setOrigin(0.5);
    this.getHighScores()
    // this.displayHighScores()
    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.6,
      "sprBtnPlay"
    );
    this.btnPlay.setInteractive();
    this.btnPlay.on("pointerover", function() {
      this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover

    }, this);
    this.btnPlay.on("pointerout", function() {
      this.setTexture("sprBtnPlay");
      });
    this.btnPlay.on("pointerdown", function() {
      this.btnPlay.setTexture("sprBtnPlayDown");
    }, this);
    this.btnPlay.on("pointerup", function() {
      this.btnPlay.setTexture("sprBtnPlay");
      if(game.user && game.car){
        if(game.error){

          game.error.destroy()
        }
      this.scene.start("SceneMain");
    }else{
      game.error = this.add.text(115, this.game.config.height * 0.6 + 25,'Please Select Car and User', { fill: '#ffffff', fontFamily: 'monospace',fontSize:16, align:'center' })

    }
    }, this);

  }
  displayHighScores(games){
    var topScores = games.slice(0,10)

    for(let i =0;i<topScores.length;i++){
      this.add.text(this.game.config.width * 0.4, (160+15*i), `${allGames[i].user.username}: ${allGames[i].score}`, { fill: '#ffffff', fontFamily: 'monospace',fontSize: 14, align:'left'});
    }
  }

  getHighScores()
  { allGames = [];
    fetch(url+'games')
    .then(res=>res.json())
    .then(games=>{
      games.forEach(g=>{
        allGames.push(g)
      })
      allGames = allGames.sort((a, b) => b.score - a.score)
      return allGames;
    })
    .then(games=>this.displayHighScores(games))
  }
} // end of SceneGameOver class
