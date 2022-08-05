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
const OFFSET_X = WIDTH / 2
const OFFSET_Y = HEIGHT / 2

export class LifeBar extends GameObjects.Graphics {
  scene: MainScene
  current: number = 0
  max: number = 0

  constructor({
    scene,
    x,
    y,
    current,
    max,
  }: LifeBarParams) {
    super(scene)
    this.scene = scene
    this.max = max
    this.current = current ?? max
    this.draw()
    this.setX(x)
    this.setY(y)
    scene.add.existing(this)
    this.depth = 1000
  }

  draw() {
    this.clear()

    // Outter white line
    this.fillStyle(0xffffff);
    this.fillRect(this.x, this.y, WIDTH, HEIGHT);

    // Inner black background
    this.fillStyle(0x000000);
    this.fillRect(
      this.x + OUTTER_BORDER_WIDTH,
      this.y + OUTTER_BORDER_WIDTH,
      WIDTH - OUTTER_BORDER_WIDTH * 2,
      HEIGHT - OUTTER_BORDER_WIDTH * 2,
    );

    const fillStartX = this.x + BORDER_WIDTH
    const fillStartY = this.y + BORDER_WIDTH

    // Filled green life
    this.fillStyle(0x00ff00);
    this.fillRect(
      fillStartX,
      fillStartY,
      this.lifeWidth,
      FILL_HEIGHT,
    );
  
    // Life bar sections
    for (let i = 1; i < this.max; ++i) {
      const offsetX = Math.ceil(FILL_WIDTH / this.max * i )
      this.lineStyle(1, 0x000000);
      this.lineBetween(
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
    this.visible = true
  }

  hide() {
    this.visible = false
  }

  setX(value: number): this {
    return super.setX(value - OFFSET_X)
  }
  setY(value: number): this {
    return super.setY(value - OFFSET_Y)
  }
}