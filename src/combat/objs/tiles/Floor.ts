import MainScene from "../../scenes/GameScene";
import { Tile } from "./Tile";

export const FLOOR_SPRITE = 'floor'

export class Floor extends Tile {
  declare scene: MainScene
  name = 'Floor'
  description = 'A basic tile'
  constructor(scene: MainScene, x: number, y: number) {
    super(FLOOR_SPRITE, scene, x, y)
  }
}
