import CombatScene from "../../scenes/CombatScene";
import { IsometricSprite } from "../IsometricSprite";
import { Unit } from "../units/Unit";

export abstract class Tile extends IsometricSprite {
  unit?: Unit
  canHaveUnit = true
  abstract name: string
  abstract description: string
  constructor(texture: string, scene: CombatScene, x: number, y: number) {
    super(texture, {
      scene,
      x,
      y,
    })
    this.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.scene.events.emit('select-tile', this)
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
    this.scene.events.addListener('remove-tiles-paint', () => {
      this.clearTint()
    })
    this.setInteractive()
    // if ((this.gridX % 2) || (this.gridY % 2)) return
    // this.scene.add.text(this.x - this.width /2, this.y - this.height/2, `${this.depth}`, {
    //   fontSize: '10px'
    // }).setDepth(700000)
  }

  select() {
    this.unit?.select()
    this.setTint(0xa0ffa0)
  }

  deselect() {
    this.unit?.deselect()
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
    if (this.unit && this.unit.getController() !== unit.getController()) return false
    return true
  }

  canBeOcupied(unit: Unit) {
    if (this.unit) return false
    return this.canHaveUnit
  }

  paintMovableSelect(color: number) {
    this.setTint(color)
  }

  paintAttackableTile() {
    this.setTint(0xff0000)
  }

}
