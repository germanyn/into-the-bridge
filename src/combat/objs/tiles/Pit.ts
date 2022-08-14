import CombatScene from "../../scenes/CombatScene";
import { Unit } from "../units/Unit";
import { Tile } from "./Tile";

export const PIT_SPRITE = 'pit'

export class Pit extends Tile {
  declare scene: CombatScene
  name = 'Pit'
  description = 'Most of the units die when pushed here'
  constructor(scene: CombatScene, x: number, y: number) {
    super(PIT_SPRITE, {
      scene,
      x,
      y,
    })
  }
  isWalkableBy(): boolean {
    return false
  }
  addUnit(unit: Unit): void {
    super.addUnit(unit)
    unit.depth = this.depth + 0.5
    unit.die()
    // fall
    this.scene.tweens.add({
      targets: unit,
      y: unit.y + unit.offsetY + 48,
      duration: 250,
    })
  }
}
