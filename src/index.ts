import Phaser from 'phaser';
import config from './config';
import GameScene from './combat/scenes/CombatScene';
import { UIScene } from './combat/scenes/UIScene';

new Phaser.Game({
  ...config,
  scene: [GameScene, UIScene],
});
