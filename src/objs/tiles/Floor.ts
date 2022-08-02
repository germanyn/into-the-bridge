import MainScene from "../../scenes/GameScene";
import { OutlinePipeline } from "../shaders/OutlinePipeline"
import { IsometricSprite } from "../IsometricSprite";
import { Unit } from "../Unit";

export const FLOOR_SPRITE = 'floor'

export class Floor extends IsometricSprite {
  declare scene: MainScene
  unit?: Unit
  selected = false
  name = 'Floor'
  description = 'A basic tile'
  constructor(scene: MainScene, x: number, y: number) {
    super(FLOOR_SPRITE, {
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
    this.scene.events.emit('deselect-all')
    this.scene.events.emit('select-tile', this)
    this.selected = true
    this.setPipeline(OutlinePipeline.KEY)
    this.pipeline.set2f(
      "uTextureSize",
      this.texture.getSourceImage().width,
      this.texture.getSourceImage().height
    );
  }

  deselect() {
    if (!this.selected) return
    this.selected = false
    this.resetPipeline()
  }

  addUnit(unit: Unit) {
    this.unit = unit
  }
}
