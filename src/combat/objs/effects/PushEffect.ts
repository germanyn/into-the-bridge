import CombatScene from "../../scenes/CombatScene";
import { Tile } from "../tiles/Tile";
import { Effect } from "./Effect";

export class PushEffect extends Effect {
  constructor(
    scene: CombatScene,
    public tile: Tile,
    public direction: Phaser.Math.Vector2,
  ) {
    super(scene)
  }
  async apply() {
    if (!this.tile) return
    if (!this.tile.unit) return
    return this.tile.unit.push(this.direction)
  }
}