import { Tile } from "../tiles/Tile";
import { Effect } from "./Effect";

export class PushEffect extends Effect {
  constructor(
    public tile: Tile,
    public direction: Phaser.Math.Vector2,
  ) {
    super(tile)
  }
  apply() {
    if (!this.tile) return
    if (!this.tile.unit) return
    this.tile.unit.push(this.direction)
  }
}