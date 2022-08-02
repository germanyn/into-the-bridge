import MainScene from "../../scenes/Game";
import { OutlinePipeline } from "../shaders/OutlinePipeline"
import { IsometricSprite } from "../IsometricSprite";
import { Unit } from "../Unit";

export const FLOOR_SPRITE = 'floor'

export class Floor extends IsometricSprite {
  unit?: Unit
  selected = false
  constructor(scene: MainScene, x: number, y: number) {
    super(FLOOR_SPRITE, {
      scene,
      x,
      y,
    })
    this.on('pointerdown', () => {
      this.toggle()
    })
    this.on('pointerover', () => {
      this.setAlpha(0.5)
    })
    this.on('pointerout', () => {
      this.setAlpha(1)
    })
    this.setInteractive()
  }

  toggle() {
    this.selected
      ? this.deselect()
      : this.select()
  }

  select() {
    this.selected = true
    this.setPipeline(OutlinePipeline.KEY)
    this.pipeline.set2f(
      "uTextureSize",
      this.texture.getSourceImage().width,
      this.texture.getSourceImage().height
    );
  }

  deselect() {
    console.log('deselect')
    this.selected = false
    this.resetPipeline()
  }
}
