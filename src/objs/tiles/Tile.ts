import MainScene from "../../scenes/GameScene";
import { IsometricSprite } from "../IsometricSprite";
import { Unit } from "../Unit";

export abstract class Tile extends IsometricSprite {
  unit?: Unit
  selected = false
  canHaveUnit = true
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
      this.clearTint()
      this.deselect()
    })
    this.setInteractive()
    // if ((this.gridX % 2) || (this.gridY % 2)) return
    // this.scene.add.text(this.x - this.width /2, this.y - this.height/2, `${this.depth}`, {
    //   fontSize: '10px'
    // }).setDepth(700000)
  }

  select() {
    if (this.selected) return
    if (this.scene.selectedUnit) {
      const moved = this.scene.selectedUnit.moveTo(this)
      if (moved) return
    }
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
    unit.gridX = this.gridX
    unit.gridY = this.gridY
  }

  removeUnit() {
    this.unit = undefined
  }

  isWalkableBy(unit: Unit) {
    if (this.unit && this.unit.controller !== unit.controller) return false
    return true
  }

  canBeOcupied(unit: Unit) {
    if (this.unit) return false
    return this.canHaveUnit
  }

  paintMovableSelect() {
    this.setTint(0xff0000)
  }
}
