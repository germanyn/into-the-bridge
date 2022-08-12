import CombatScene from "../../scenes/CombatScene";
import { IsometricSprite } from "../IsometricSprite";
import { Tile } from "../tiles/Tile";
import { Effect } from "./Effect";

export class PushEffect extends Effect {
  constructor(
    scene: CombatScene,
    public tile: Tile,
    public direction: Phaser.Math.Vector2,
    buildAnimation?: (tile: Tile) => IsometricSprite
  ) {
    super(scene)
    this.buildAnimation = buildAnimation
  }
  async apply() {
    if (!this.tile) return
    this.applyAnimation(this.tile)
    if (!this.tile.unit) return
    return this.tile.unit.push(this.direction)
  }
}