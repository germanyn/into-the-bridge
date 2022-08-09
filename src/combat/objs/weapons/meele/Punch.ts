import { Math } from "phaser";
import CombatScene from "../../../scenes/CombatScene";
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
  icon = 'sword-icon'

  constructor(scene: CombatScene) {
    super(scene)
    this.pathSize = 1
    this.damage = 1
  }

  getSkillEffect(originTile: Tile, targetTile: Tile): Effect[] {
    if (!originTile) return []
    const origin = originTile.point
    const target = targetTile.point
    const direction = target.subtract(origin.clone()).normalize()
    return [
      new DirectDamageEffect(this.scene, targetTile, this.damage),
      new PushEffect(this.scene, targetTile, direction),
    ]
  }

  async attack(origin: Tile, target: Tile): Promise<boolean> {
    const unit = origin.unit
    const direction = new Math.Vector2(target.x, target.y)
      .subtract(new Math.Vector2(origin.x, origin.y)).normalize()
    if (!unit) return super.attack(origin, target)
    const animationEndPoint = new Math.Vector2(direction.clone())
      .multiply({ x: 16, y: 16 })
      .add({ x: unit.x, y: unit.y })
    const animation = this.scene.tweens.add({
      targets: unit,
      x: animationEndPoint.x,
      y: animationEndPoint.y,
      duration: 100,
      yoyo: true,
      paused: true,
    })
    const bouncing = new Promise<boolean>(async resolve => {
      animation.once(Phaser.Tweens.Events.TWEEN_YOYO, async () => {
        const success = await super.attack(origin, target)
        resolve(success)
      })
    })
    const endingAnimation = new Promise<void>(async resolve => {
      animation.once(Phaser.Tweens.Events.TWEEN_YOYO, () => {
        resolve()
      })
    })
    animation.play()
    const attacked = await bouncing
    await endingAnimation
    return attacked
  }

}