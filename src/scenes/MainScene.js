import 'phaser';
//import BaseScene from './BaseScene';

import Board from '../entity/Board';
import Piece from '../entity/Piece';
import Square from '../entity/Square';
import config from '../config/config';
import RegexOption from '../entity/RegexOption';

const regexData = [
  /[abfn]/,
  /[ABFN]/,
  /\d/,
  /[^abfn]/,
  /[^ABFN]/,
  /\D/,
  /\s/,
  /[^\w\d\s]/,
];

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.spritesheet('square', 'assets/spritesheets/WHITEtetrominos.png', {
      frameWidth: 28,
      frameHeight: 28,
    });
    this.load.image('fairy', 'assets/menuSprites/FAIRY.png');
  }

  create() {
    this.foregroundColor = 0x000000;
    this.pieceCount = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.shift = this.input.keyboard.addKey('SHIFT');
    this.gameOver = false;
    this.regexScore = 0;
    this.score = 0;
    this.destroyedRows = 0;
    this.level = 0;

    //container border
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(5, 0xffffff, 1);

    //move board to center of page
    this.gameBoardLoc = [450, 70];
    this.regexBankLoc = [850, 100];

    //visual "containers" for game displays
    this.gameBoard = this.add
      .rectangle(this.gameBoardLoc[0], this.gameBoardLoc[1], 300, 600, this.foregroundColor)
      .setOrigin(0);
    this.graphics.strokeRectShape(this.gameBoard);

    this.regexBoard = this.add
      .rectangle(850, 100, 250, 570, this.foregroundColor)
      .setOrigin(0);
    this.graphics.strokeRectShape(this.regexBoard);
    this.regexContolsDisplay = this.add.text(860, 110, 'Press SHIFT', {
      fontFamily: 'retroFont',
      fontSize: '20px',
    });
    this.regexContolsDisplay = this.add.text(
      860,
      140,
      'to change RegEx choice',
      { fontFamily: 'retroFont', fontSize: '14px' }
    );
    this.regexOptions = this.physics.add.group({ classType: RegexOption });
    regexData.forEach((re, idx) => {
      this.regexOptions.add(
        new RegexOption(
          this,
          this.regexBankLoc[0] + 50,
          this.regexBankLoc[1] + 100 + 50 * idx,
          re
        )
      );
    });

    this.regexChoice = this.regexOptions.getChildren()[0].re;

    this.regexFairy = this.physics.add
      .sprite(this.regexBankLoc[0] + 10, this.regexBankLoc[1] + 100, 'fairy')
      .setDisplaySize(45, 45)
      .setOrigin(0);

    this.scoreBoard = this.add
      .rectangle(100, 370, 250, 300, this.foregroundColor)
      .setOrigin(0);
    this.graphics.strokeRectShape(this.scoreBoard);
    this.scoreDisplay = this.add.text(
      110,
      400,
      `Tetris Score: ${this.score}\n\nRegEx Score: ${this.regexScore}`,
      { fontFamily: 'retroFont', fontSize: '16px' }
    );

    this.nextPieceBoard = this.add
      .rectangle(100, 100, 250, 250, this.foregroundColor)
      .setOrigin(0);
    this.graphics.strokeRectShape(this.nextPieceBoard);
    this.tetrisContolsDisplay = this.add.text(
      110,
      110,
      'UP = rotate\n\nDOWN = fall faster\n\nRIGHT = move right\n\nLEFT = move left',
      { fontFamily: 'retroFont', fontSize: '16px' }
    );
    this.gameBoardHeader = this.add
      .rectangle(this.gameBoardLoc[0], 0, 300, 90, config.backgroundColor)
      .setOrigin(0)
      .setDepth(10);
    this.graphics.lineStyle(5, 0x00000, 1);
    this.graphics.strokeRectShape(this.gameBoardHeader);

    this.timer = this.add
      .sprite(225, 570, 'square', 10)
      .setDisplaySize(75, 75)
      .setVisible(false);

    this.anims.create({
      key: 'countDown',
      frames: this.anims.generateFrameNumbers('square', { start: 11, end: 9 }),
      frameRate: 1,
      repeat: 0,
    });

    //groups for pieces
    this.pieces = this.physics.add.group({ classType: Piece });
    //group for landed squares
    this.squares = this.physics.add.group({ classType: Square });
    //methods and data for game board grid
    this.board = new Board(this);
    //create first piece
    this.pieces.add(
      new Piece(this, Phaser.Math.RND.pick(['I', 'J', 'L', 'O', 'S', 'T', 'Z']))
    );
  }
  update() {
    //only update most recently created piece
    if (Phaser.Input.Keyboard.JustUp(this.cursors.shift)) {
      if (this.regexFairy.y === this.regexBankLoc[1] + 450) {
        this.regexFairy.y = this.regexBankLoc[1] + 100;
      } else {
        this.regexFairy.y += 50;
      }
      const currentRegex = this.regexOptions
        .getChildren()
        .filter((option) => option.y === this.regexFairy.y);
      this.regexChoice = currentRegex[0].re;
    }
    this.piece = this.pieces.getLast(true);
    this.piece.update();
    this.scoreDisplay.setText(
      `Tetris Score: ${this.score}\n\nRegEx Score: ${this.regexScore}`
    );
  }
}
