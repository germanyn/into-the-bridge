import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/GameScene';

new Phaser.Game({
  ...config,
  scene: [GameScene],
  pixelArt: true,
});
