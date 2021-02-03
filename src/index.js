import 'phaser';
import config from './config/config';

import MainScene from './scenes/MainScene';
import AliasScene from './scenes/AliasScene';
import PasswordScene from './scenes/PasswordScene';
import MenuScene from './scenes/MenuScene';
import GameOverScene from './scenes/GameOverScene';

import store from "./store";
import { me } from "./store/singlePlayer";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add('MainScene', MainScene);
    this.scene.add('AliasScene', AliasScene);
    this.scene.add('PasswordScene', PasswordScene);
    this.scene.add('MenuScene', MenuScene);
    this.scene.add('GameOverScene', GameOverScene);
    this.scene.start('AliasScene');
  }
}

new Game(config);
