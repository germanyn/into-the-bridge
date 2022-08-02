import MainScene from "../../scenes/GameScene";
import { IsometricSprite } from "../IsometricSprite";
import { Unit } from "../Unit";

export abstract class Tile extends IsometricSprite {
  unit?: Unit
  selected = false
  abstract name: string
  abstract description: string
  constructor(texture: string, scene: MainScene, x: number, y: number) {
    super(texture, {
      scene,
      x,
      y,
    })
    this.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.select()
    })
    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.setAlpha(0.5)
    })
    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.setAlpha(1)
    })
    this.scene.events.addListener('deselect-all', () => {
      this.deselect()
    })
    this.setInteractive()
  }

  select() {
    if (this.selected) return
    if (this.unit) this.unit.select()
    this.scene.events.emit('deselect-all')
    this.scene.events.emit('select-tile', this)
    this.selected = true
    this.setTint(0xa0ffa0)
  }

  deselect() {
    if (!this.selected) return
    if (this.unit) this.unit.deselect()
    this.selected = false
    this.clearTint()
  }

  addUnit(unit: Unit) {
    this.unit = unit
  }
}
