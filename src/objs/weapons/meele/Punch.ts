import { Tile } from "../../tiles/Tile";
import { Effect } from "../../effects/Effect";
import { RangeType } from "../RangeType";
import { Weapon } from "../Weapon";
import { DirectDamageEffect } from "../../effects/DirectDamageEffect";
import { Unit } from "../../Unit";
import { PushEffect } from "../../effects/PushEffect";
import MainScene from "../../../scenes/GameScene";

export class Punch extends Weapon {
  name = 'Punch'
  description = 'Damage target and pushs'
  rangeType = RangeType.DIRECT

  constructor(scene: MainScene) {
    super(scene)
    this.pathSize = 1
    this.damage = 1
  }

  getSkillEffect(unit: Unit, targetTile: Tile): Effect[] {
    if (!unit.currentTile) return []
    const origin = new Phaser.Math.Vector2(unit.currentTile.gridX, unit.currentTile.gridY)
    const target = new Phaser.Math.Vector2(targetTile.gridX, targetTile.gridY)
    const direction = target.subtract(origin.clone()).normalize()
    return [
      new DirectDamageEffect(targetTile, this.damage),
      new PushEffect(targetTile, direction),
    ]
  }

}