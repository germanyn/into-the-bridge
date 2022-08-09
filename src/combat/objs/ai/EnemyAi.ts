import { ALL_DIRECTIONS } from "../../constants/directions-constants";
import CombatScene from "../../scenes/CombatScene";
import { DirectDamageEffect } from "../effects/DirectDamageEffect";
import { Unit } from "../Unit";
import { UnitAction } from "../UnitAction";

export const SCORE_DAMAGE_ENEMY = 5
export const SCORE_DAMAGE_BUILDING = 5
export const SCORE_FRIENDLY_FIRE = -2
export const SCORE_NOTHING = 0

export class EnemyAi {
  constructor(public scene: CombatScene) {}

  chooseBestAction(enemy: Unit): UnitAction | undefined {
    const possibleActions = enemy.possibleActions
    const actionsWithScore = possibleActions.map<{
      action: UnitAction,
      score: number
    }>(action => ({
      action,
      score: this.scoreAction(action),
    }))
    const maxScore = Math.max(...actionsWithScore.map(({ score }) => score))
    // It's all bad decisions / does nothing
    if (maxScore <= 0) return

    const topActions = actionsWithScore.filter(({ score }) => score === maxScore)
    if (topActions.length === 1) return topActions[0].action

    const lessEffortDecision = [...topActions]
      .sort((actionA, actionB) => {
        return actionA.action.distance - actionB.action.distance
      })
    return lessEffortDecision[0].action
  }

  scoreAction(action: UnitAction) {
    return action.isJustMovement
      ? this.scoreMovement(action)
      : this.scoreAttack(action)
  }

  scoreAttack(action: UnitAction) {
    let score = 0
    action.effects.forEach(effect => {
      if (effect instanceof DirectDamageEffect) {
        if (!effect.tile.unit) {
          score += SCORE_NOTHING
        } else {
          if (effect.tile.unit.controller !== action.team) {
            score += SCORE_DAMAGE_ENEMY
          } else {
            score += SCORE_FRIENDLY_FIRE
          }
        }
      }
    })
    return score
  }

  scoreMovement(action: UnitAction) {
    // Try to get meele
    // TODO test if is a meele unit
    for (const direction of ALL_DIRECTIONS) {
      const positionAtDirection = action.endTile.point
        .clone()
        .add(direction)
      const facingTile = this.scene.board.getTileAt(positionAtDirection)
      if (!facingTile) continue

      if (facingTile.unit && facingTile.unit.controller !== action.unit.controller) return 5
    }

    const closestEnemy = this.scene.board.getClosestUnitDistance(action.endTile.point, action.unit.controller)
    if (typeof closestEnemy === 'undefined') return SCORE_NOTHING

    return Math.max(0, (10 - closestEnemy) / 2)
  }
}