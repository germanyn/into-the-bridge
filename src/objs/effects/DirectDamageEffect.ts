import { Tile } from "../tiles/Tile";
import { Effect } from "./Effect";

export class DirectDamageEffect extends Effect {
  constructor(
    public tile: Tile,
    public amount: number,
  ) {
    super(tile)
  }
  apply() {
    if (!this.tile) return
    if (!this.tile.unit) return
    this.tile.unit.hurt(this.amount)
  }
}