import { DOWN, RIGHT, UP } from "../../constants/directions-constants";
import { createSpriteMovementAnimation } from "../../utils";
import CombatScene from "../../scenes/CombatScene";
import { IsometricSprite } from "../IsometricSprite";
import { Effect } from "./Effect";

export type OnProjectileHitHander = (target: Phaser.Math.Vector2) => Effect[]

export class ArtilleryEffect extends Effect {
  constructor(
    scene: CombatScene,
    public origin: Phaser.Math.Vector2,
    public direction: Phaser.Math.Vector2,
    public distance: number,
    public onHit: OnProjectileHitHander,
  ) {
    super(scene)
  }
  async apply() {
    const path = this.projectilePath
    if (!path.length) return
    const startPoint = this.origin.clone()
      .add(this.direction)
    const tileOffset = this.getTileOffset(this.direction)

    const spriteOffsetY = -8
    const arrow = new IsometricSprite('arrow', {
      scene: this.scene,
      x: startPoint.x,
      y: startPoint.y,
      offsetX: tileOffset.x,
      offsetY: tileOffset.y + spriteOffsetY,
      frame: 0,
    })
    arrow.setScale(1/4)
    if (this.direction.equals(UP)) {
      arrow.setAngle(60)
    } else if (this.direction.equals(RIGHT)) {
      arrow.setAngle(120)
    } else if (this.direction.equals(DOWN)) {
      arrow.setAngle(-120)
    } else {
      arrow.setAngle(-60)
    }
    this.scene.add.existing(arrow)

    const animation = createSpriteMovementAnimation(
      arrow,
      path,
      {
        duration: 120,
      },
    )

    const targetHitAnimation = new Promise<void>(resolve => {
      animation.once(Phaser.Tweens.Events.TIMELINE_COMPLETE, () => {
        arrow.destroy()
        resolve()
      })
    })
    animation.play()
    await targetHitAnimation

    const lastPoint = path.at(-1)
    if (!lastPoint) return
    const targetTile = this.scene.board.getTileAt(lastPoint)
    if (!targetTile) return

    const onHitEffects = this.onHit(targetTile.point)
    for (const effect of onHitEffects) {
      await effect.apply()
    }
    return
  }

  getTileOffset(direction: Phaser.Math.Vector2) {
    return this.direction.clone()
      .multiply({ x: -8, y: -4})
  }

  get projectilePath() {
    const path: Phaser.Math.Vector2[] = []
    let target = this.origin.clone()
    for (let i = 0; i < this.distance; ++i) {
      target.add(this.direction)
      const tile = this.scene.board.getTileAt(target)
      if (!tile) return path
      path.push(target.clone())
    }
    return path
  }
}