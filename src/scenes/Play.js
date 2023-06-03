class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }

  preload() {
    // Load the necessary images
    this.load.image("player", "assets/spaceship.png");
    this.load.image("obstacle1", "assets/enemy1.png");
    this.load.image("obstacle2", "assets/enemy2.png");
    this.load.image("obstacle3", "assets/enemy3.png");
    this.load.image("obstacle4", "assets/enemy4.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.image("background", "assets/background.png");

    // Load sound effects
    this.load.audio("shootSound", "assets/shoot.mp3");
    this.load.audio("destroySound", "assets/destroy.mp3");

    // Load background music
    this.load.audio("bgMusic", "assets/bgmusic.mp3");
    // Load sound effect for starting and restarting
    this.load.audio("startSound", "assets/gamestart.mp3");
    this.load.audio("restartSound", "assets/select.mp3");
  }

  create() {
    // Create the background
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    // Set up lane variables
    this.playerLane = 1;
    this.laneWidth = 200;
    this.lanes = [
      this.laneWidth,
      this.laneWidth * 2,
      this.laneWidth * 3
    ];

    // Create player and set up physics
    this.player = this.physics.add.sprite(this.lanes[this.playerLane], 500, "player");
    this.player.setCollideWorldBounds(true);

    // Register input listeners
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Create obstacles group
    this.obstacles = this.physics.add.group();

    // Create bullets group
    this.bullets = this.physics.add.group();

    // Start spawning obstacles
    this.spawnObstacles();

    // Initialize game over state
    this.isGameOver = false;

    // Initialize score
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Load sound effects
    this.shootSound = this.sound.add("shootSound");
    this.destroySound = this.sound.add("destroySound");
    // Load background music
    this.bgMusic = this.sound.add("bgMusic");
    // Load sound effect for starting and restarting
    this.startSound = this.sound.add("startSound");
    this.restartSound = this.sound.add("restartSound");

    // Play background music
    this.bgMusic.play({ loop: true });

    // Play start sound effect
    this.startSound.play();
  }

  update() {
    if (this.isGameOver) return; // Skip the update if the game is over

    // Scroll the background
    this.background.tilePositionY -= 2;

    // Check for player movement input
    if (this.cursors.left.isDown && this.playerLane > 0 && this.player.x <= this.lanes[this.playerLane]) {
      this.playerLane--;
    } else if (this.cursors.right.isDown && this.playerLane < this.lanes.length - 1 && this.player.x >= this.lanes[this.playerLane]) {
      this.playerLane++;
    }

    // Move the player to the target lane
    const targetX = this.lanes[this.playerLane];
    const dx = targetX - this.player.x;
    const playerSpeed = 5;
    this.player.x += Phaser.Math.Clamp(dx, -playerSpeed, playerSpeed);

    // Recycle obstacles when they go off the screen
    this.obstacles.getChildren().forEach((obstacle) => {
      if (obstacle.y > config.height) {
        obstacle.y = -50;
        obstacle.x = this.lanes[obstacle.getData("laneIndex")];
        this.increaseScore();
      }

      // Check for collision between player and obstacle
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), obstacle.getBounds())) {
        this.gameOver();
      }
    });

    // Shoot bullet when spacebar is pressed
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.shootBullet();
    }

    // Check for bullet-enemy collision
    this.bullets.getChildren().forEach((bullet) => {
      this.obstacles.getChildren().forEach((obstacle) => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), obstacle.getBounds())) {
          this.destroyObstacle(obstacle);
          this.destroyBullet(bullet);
          this.increaseScore();
        }
      });
    });
  }

  spawnObstacles() {
    // Set up obstacle spawn timer
    this.obstacleSpawnTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        const laneIndex = Phaser.Math.Between(0, 2);
        const laneX = this.lanes[laneIndex] + this.laneWidth / 2;

        const obstacleType = Phaser.Math.Between(1, 4); // Randomly select enemy type

        const obstacle = this.obstacles.create(laneX, -50, `obstacle${obstacleType}`);
        obstacle.setVelocityY(200);
        obstacle.setData("laneIndex", laneIndex);
      },
      callbackScope: this,
      loop: true
    });
  }

  shootBullet() {
    const bullet = this.bullets.create(this.player.x, this.player.y, "bullet");
    bullet.setVelocityY(-400);

    // Play shoot sound effect
    this.shootSound.play();
  }

  destroyObstacle(obstacle) {
    obstacle.destroy();

    // Play destroy sound effect
    this.destroySound.play();
  }

  destroyBullet(bullet) {
    bullet.destroy();
  }

  gameOver() {
    this.isGameOver = true;
    this.obstacleSpawnTimer.paused = true;
    this.player.setTint(0xff0000);
    this.gameOverText = this.add.text(config.width / 2, config.height / 2 - 50, 'Game Over', {
      fontSize: '48px',
      fill: '#fff'
    });
    this.gameOverText.setOrigin(0.5);

    // Add art and music credits
    this.artCreditText = this.add.text(config.width / 2, config.height / 2 + 50, 'Art by me', {
      fontSize: '24px',
      fill: '#fff'
    });
    this.artCreditText.setOrigin(0.5);

    this.musicCreditText = this.add.text(config.width / 2, config.height / 2 + 100, 'Music by Pixabay', {
      fontSize: '24px',
      fill: '#fff'
    });
    this.musicCreditText.setOrigin(0.5);

    // Play restart sound effect
    this.restartSound.play();

    // Create restart button
    this.restartButton = this.add.text(config.width / 2, config.height / 2 + 200, 'Restart', {
      fontSize: '32px',
      fill: '#fff'
    });
    this.restartButton.setOrigin(0.5);
    this.restartButton.setInteractive();
    this.restartButton.on('pointerdown', () => {
      this.scene.restart();
    });
  }
  restartGame() {
    this.scene.restart();
    this.startSound.play(); // Play the start sound effect again
  
    // Stop and play background music
    this.bgMusic.stop();
    this.bgMusic.play({ loop: true });
  }
  
  increaseScore() {
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
