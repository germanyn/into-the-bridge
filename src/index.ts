import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';

new Phaser.Game({
  ...config,
  scene: [GameScene],
  pixelArt: true,
});
