import { IsometricSprite } from "../objs/IsometricSprite";
import { Unit } from "../objs/Unit";

export function createSpriteMovementAnimation(
  sprite: Unit | IsometricSprite,
  path: Phaser.Math.Vector2[],
  {
    duration = 175,
  }: {
    duration?: number,
  }
): Phaser.Tweens.Timeline {
  const { scene } = sprite
  const timeline = scene.tweens.createTimeline()
  let previousDepth = IsometricSprite.calculatePositionDepth(sprite.gridX, sprite.gridY)
  for (const node of path) {
    const currentDepth = previousDepth
    const [newX, newY] = scene.calculateTilePosition(node)
    const newDepth = IsometricSprite.calculatePositionDepth(node.x, node.y)
    timeline.add({
      targets: sprite,
      x: newX + sprite.offsetX,
      y: newY + sprite.offsetY,
      onStart: () => {
        if (newDepth > currentDepth ) return
        sprite.depth = newDepth + 1
      },
      onComplete: () => {
        sprite.depth = newDepth + 1
      },
      duration,
    })
    previousDepth = currentDepth
  }
  return timeline
}