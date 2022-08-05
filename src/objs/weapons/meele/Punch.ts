import { Math } from "phaser";
import MainScene from "../../../scenes/GameScene";
import { DirectDamageEffect } from "../../effects/DirectDamageEffect";
import { Effect } from "../../effects/Effect";
import { PushEffect } from "../../effects/PushEffect";
import { Tile } from "../../tiles/Tile";
import { RangeType } from "../RangeType";
import { Weapon } from "../Weapon";

export class Punch extends Weapon {
  name = 'Punch'
  description = 'Damage target and pushs'
  rangeType = RangeType.DIRECT

  constructor(scene: MainScene) {
    super(scene)
    this.pathSize = 1
    this.damage = 1
  }

  getSkillEffect(originTile: Tile, targetTile: Tile): Effect[] {
    if (!originTile) return []
    const origin = new Phaser.Math.Vector2(originTile.gridX, originTile.gridY)
    const target = new Phaser.Math.Vector2(targetTile.gridX, targetTile.gridY)
    const direction = target.subtract(origin.clone()).normalize()
    return [
      new DirectDamageEffect(targetTile, this.damage),
      new PushEffect(targetTile, direction),
    ]
  }

  attack(origin: Tile, target: Tile): boolean {
    const attacked = super.attack(origin, target)
    if (!attacked) return false
    const unit = origin.unit
    const direction = new Math.Vector2(target.x, target.y)
      .subtract(new Math.Vector2(origin.x, origin.y)).normalize()
    if (!unit) return super.attack(origin, target)
    const animationEndPoint = new Math.Vector2(direction.clone())
      .multiply({ x: 16, y: 16 })
      .add({ x: unit.x, y: unit.y })
    this.scene.tweens.add({
      targets: unit,
      x: animationEndPoint.x,
      y: animationEndPoint.y,
      duration: 100,
      yoyo: true,
    });
    return true
  }

}