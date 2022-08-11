import CombatScene from "../../scenes/CombatScene";
import { IsometricSprite } from "../IsometricSprite";
import { Tile } from "../tiles/Tile";

export abstract class Effect {
  buildAnimation?: (tile: Tile) => IsometricSprite
  constructor(public scene: CombatScene) {}

  abstract apply(): Promise<void>
  applyAnimation(tile: Tile) {
    if (this.buildAnimation) {
      this.buildAnimation(tile)
    }
  }
}