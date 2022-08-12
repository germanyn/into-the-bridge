import { randomIntFromInterval } from "../../../utils/number-utils";
import CombatScene from "../../scenes/CombatScene";
import { Tile } from "./Tile";

export const FLOOR_SPRITE = 'floor'

export class Floor extends Tile {
  declare scene: CombatScene
  name = 'Floor'
  description = 'A basic tile'
  constructor(scene: CombatScene, x: number, y: number) {
    const sheet = scene.textures.get(FLOOR_SPRITE)
    
    super(FLOOR_SPRITE, {
      scene,
      x,
      y,
      frame: randomIntFromInterval(0, sheet.frameTotal - 1),
    })
  }
}
