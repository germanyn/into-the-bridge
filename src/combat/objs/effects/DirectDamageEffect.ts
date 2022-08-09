import CombatScene from "../../scenes/CombatScene";
import { Tile } from "../tiles/Tile";
import { Effect } from "./Effect";

export class DirectDamageEffect extends Effect {
  constructor(
    scene: CombatScene,
    public tile: Tile,
    public damage: number,
  ) {
    super(scene)
  }
  async apply() {
    if (!this.tile) return
    if (!this.tile.unit) return
    return this.tile.unit.hurt(this.damage)
  }
}