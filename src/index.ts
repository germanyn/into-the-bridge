import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';

new Phaser.Game({
  ...config,
  scene: [GameScene, UIScene],
});
