import Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  scale: {
    width: '900px',
    height: '600px',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

export default config