import { Floor } from "../objs/tiles/Floor";
import { GAME_SCENE_KEY } from "./GameScene";

export const UI_SCENE_KEY = 'UIScene'

export class UIScene extends Phaser.Scene {
  score = 0
  constructor() {
    super({
      key: UI_SCENE_KEY,
      active: true,
    })
  }

  create() {
    const name = this.add.text(10, 10, '', { font: 'bold 14px Arial' });
    const description = this.add.text(10, 24, '', { font: '10px Arial' });

    const game = this.scene.get(GAME_SCENE_KEY);

    game.events.on('deselect-all', () => {
      name.setText('')
      description.setText('')
    });

    game.events.on('select-tile', (tile: Floor) => {
      name.setText(tile.name)
      description.setText(tile.description)
    })
  }
}