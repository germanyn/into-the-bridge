import { GameObjects } from "phaser";
import MainScene from "../../scenes/GameScene";

export type LifeBarParams = {
  scene: MainScene
  x: number
  y: number
  current?: number
  max: number
}

const WIDTH = 18
const HEIGHT = 8
const OUTTER_BORDER_WIDTH = 1
const INNER_BORDER_WIDTH = 1
const BORDER_WIDTH = OUTTER_BORDER_WIDTH + INNER_BORDER_WIDTH
const FILL_HEIGHT = HEIGHT - BORDER_WIDTH * 2
const FILL_WIDTH = WIDTH - BORDER_WIDTH * 2

export class LifeBar {
  scene: MainScene
  x: number
  y: number
  bar: GameObjects.Graphics
  current: number = 0
  max: number = 0

  constructor({
    scene,
    x,
    y,
    current,
    max,
  }: LifeBarParams) {
    this.scene = scene
    this.x = x
    this.y = y
    this.max = max
    this.current = current ?? max
    this.bar = new GameObjects.Graphics(scene)
    this.draw()
    scene.add.existing(this.bar)
    this.bar.depth = 1000
  }

  draw() {
    this.bar.clear()

    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x, this.y, WIDTH, HEIGHT);

    this.bar.fillStyle(0x000000);
    this.bar.fillRect(
      this.x + OUTTER_BORDER_WIDTH,
      this.y + OUTTER_BORDER_WIDTH,
      WIDTH - OUTTER_BORDER_WIDTH * 2,
      HEIGHT - OUTTER_BORDER_WIDTH * 2,
    );

    const fillStartX = this.x + BORDER_WIDTH
    const fillStartY = this.y + BORDER_WIDTH

    this.bar.fillStyle(0x00ff00);
    this.bar.fillRect(
      fillStartX,
      fillStartY,
      this.lifeWidth,
      FILL_HEIGHT,
    );
  
    for (let i = 1; i < this.max; ++i) {
      const offsetX = Math.ceil(FILL_WIDTH / this.max * i )
      this.bar.lineStyle(1, 0x000000);
      this.bar.lineBetween(
        fillStartX + offsetX,
        fillStartY,
        fillStartX + offsetX,
        fillStartY + FILL_HEIGHT,
      )
    }
  }

  get lifeWidth() {
    const ratio = this.current / this.max
    console.log(ratio)
    return Math.floor(ratio * FILL_WIDTH)
  }

  show() {
    this.bar.visible = true
  }

  hide() {
    this.bar.visible = false
  }
}