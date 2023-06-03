// Kat Pe Benito
// Space Chase
// 30 hours

// Creative Tilt
//  When first reading the assignment I was particularly interested
// in the example of a highscore that remains across browser sessions
// so... I learned how to implement it with the localStorage API!

// The music I chose I really resonated with.
// And I drew all the sprites myself :D it was a lot of fun
// so of course I'm proud! I like the way the title screen looks
// and how uniform and cute all the enemies look.
// There's also a little tint on the ship once game 
// is over, I think that was a nice touch.
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [Menu, Play]
  };
  
  var game = new Phaser.Game(config);
  