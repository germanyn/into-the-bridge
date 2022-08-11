import CombatScene from "../../scenes/CombatScene";
import { IsometricSprite } from "../IsometricSprite";
import { Tile } from "../tiles/Tile";
import { Effect } from "./Effect";

export class DirectDamageEffect extends Effect {
  constructor(
    scene: CombatScene,
    public tile: Tile,
    public damage: number,
    buildAnimation?: (tile: Tile) => IsometricSprite,
  ) {
    super(scene)
    this.buildAnimation = buildAnimation
  }
  async apply() {
    if (!this.tile) return
    this.applyAnimation(this.tile)
    if (!this.tile.unit) return
    return this.tile.unit.hurt(this.damage)
  }
}