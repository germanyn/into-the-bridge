import { Floor } from "../objs/tiles/Floor";
import { Unit } from "../objs/Unit";
import { WeaponButton } from "../ui/WeaponButton";
import { GAME_SCENE_KEY } from "./CombatScene";

export const UI_SCENE_KEY = 'UIScene'

export class UIScene extends Phaser.Scene {
  weaponButtons: WeaponButton[] = []
  score = 0
  constructor() {
    super({
      key: UI_SCENE_KEY,
      active: true,
    })
  }

  preload() {
    this.load.image('sword-icon', 'assets/Icons/001-Weapon01.png')
    this.load.image('bow-icon', 'assets/Icons/005-Weapon05.png')
  }

  create() {
    const name = this.add.text(10, 10, '', { font: 'bold 14px Arial' });
    const description = this.add.text(10, 24, '', { font: '10px Arial' });
    let selectedUnit: Unit | undefined = undefined

    this.add
      .text(this.renderer.width - 68, this.renderer.height - 24, 'End Turn', { font: 'bold 14px Arial', align: 'left' })
      .setInteractive()
      .setVisible(true)
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        game.events.emit('end-turn', 0)
      })

    const game = this.scene.get(GAME_SCENE_KEY)

    game.events.on('detail-tile', (tile: Floor) => {
      name.setText(tile.name)
      description.setText(tile.description)
      name.visible = true
      description.visible = true
      const { unit } = tile
      selectedUnit = unit
      this.removeWeaponsUi()
      if (
        unit &&
        unit.getController() === 'player'
      )  {
        unit.weapons.forEach((weapon, index) => {
          this.weaponButtons.push(
            new WeaponButton(
              [
                this,
                index * WeaponButton.WIDTH,
                this.renderer.height,
              ],
              unit,
              weapon,
              unit.canAttack,
              () => game.events.emit('toggle-attack', index)
            ).setOrigin(0, 1)
          )
        })
      }
    })

    game.events.on('unit-attacked', () => {
      this.updateWeaponsUi()
    })

    game.events.on('background-click', () => {
      name.visible = false
      description.visible = false
      this.removeWeaponsUi()
    })
  }

  removeWeaponsUi() {
    this.weaponButtons.forEach(button => {
      button.destroy()
    })
    this.weaponButtons.splice(1)
  }

  updateWeaponsUi() {
    this.weaponButtons.forEach(button => {
      button.updateState()
    })
  }
}