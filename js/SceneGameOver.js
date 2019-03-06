var allGames = []

class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: "SceneGameOver" });
  }
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

  }
  displayHighScores(games){
    var topScores = games.slice(0,10)

    for(let i =0;i<topScores.length;i++){
      console.log(allGames[i])
      this.add.text(this.game.config.width * 0.5, (80+15*i), `${allGames[i].user}: ${allGames[i].score}`, { fill: '#ffffff', fontFamily: 'monospace',fontSize:14, align:'right'});
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
