import { Floor } from "../objs/tiles/Floor";
import { Unit } from "../objs/Unit";
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

  preload() {
    this.load.image('attack-icon', 'assets/Icons/001-Weapon01.png')
  }

  create() {
    const name = this.add.text(10, 10, '', { font: 'bold 14px Arial' });
    const description = this.add.text(10, 24, '', { font: '10px Arial' });
    let selectedUnit: Unit | undefined = undefined

    const game = this.scene.get(GAME_SCENE_KEY);
  
    let attackToggled = false
    const attackButton = this.add
      .image(24, this.renderer.height - 24, '')
      .setVisible(false)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        if (!selectedUnit) return
        if (!selectedUnit.canAttack) return
        if (attackToggled) return
        game.events.emit('toggle-attack', 0)
      })
    const endTurnButton = this.add
      .text(this.renderer.width - 68, this.renderer.height - 24, 'End Turn', { font: 'bold 14px Arial', align: 'left' })
      .setInteractive()
      .setVisible(true)
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        game.events.emit('end-turn', 0)
      })

    game.events.on('detail-tile', (tile: Floor) => {
      name.setText(tile.name)
      description.setText(tile.description)
      name.visible = true
      description.visible = true
      selectedUnit = tile.unit
      if (
        selectedUnit &&
        selectedUnit.controller === 'player'
      )  {
        attackButton.setTexture(selectedUnit.weapons[0].icon)
        if (!selectedUnit.canAttack) {
          attackButton.setTint(0x444444)
        }  else {
          attackButton.clearTint
        }
        attackButton.visible = true
      } else {
        attackButton.visible = false
      }
    })

    game.events.on('unit-attacked', (unit: Unit) => {
      attackToggled = false
      attackButton.setTint(0x444444)
    })

    game.events.on('background-click', () => {
      name.visible = false
      description.visible = false
      attackButton.visible = false
      attackToggled = false
    })
  }
}