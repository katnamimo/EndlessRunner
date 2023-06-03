class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {
    // Load the menu image
    this.load.image("menuImage", "assets/menu.png");
  }

  create() {
    // Display the menu image
    const menuImage = this.add.image(0, 0, "menuImage").setOrigin(0, 0);

    // Scale the menu image to fit the screen
    menuImage.displayWidth = this.game.config.width;
    menuImage.displayHeight = this.game.config.height;

    // Add text instructions
    this.add.text(this.game.config.width - 20, 20, 'How to Play', {
      fontSize: '32px',
      fill: '#fff',
      align: 'right'
    }).setOrigin(1, 0);

    this.add.text(this.game.config.width - 20, 70, 'Use the arrow keys to move', {
      fontSize: '24px',
      fill: '#fff',
      align: 'right'
    }).setOrigin(1, 0);

    this.add.text(this.game.config.width - 20, 120, 'Press the spacebar to shoot', {
      fontSize: '24px',
      fill: '#fff',
      align: 'right'
    }).setOrigin(1, 0);

    // Start the game on spacebar press
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("playScene");
    });
  }
}



