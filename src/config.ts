import Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: new Phaser.Math.Vector2(0, 0),
    },
  },
  scale: {
    width: '100%',
    height: '100%',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

export default config