import MainScene from "../scenes/GameScene"
import { EnemyAi } from "./ai/EnemyAi"

export type PhaseType =
  | 'Enemy Planning'
  | 'Player Planning'
  | 'Do Actions'

export class Turn {

  static phases: PhaseType[] = [
    'Enemy Planning',
    'Player Planning',
    'Do Actions',
  ]

  constructor(public scene: MainScene) {}

  phaseIndex = 0

  start() {
    this.scene.board.newTurn()
    this.phaseIndex = 0
    this.executePhase()
  }

  toNextPhase() {
    this.phaseIndex = (this.phaseIndex + 1) % (Turn.phases.length)
    this.executePhase()
  }

  get phase() {
    return Turn.phases[this.phaseIndex]
  }

  async executePhase() {
    switch(this.phase) {
      case 'Enemy Planning':
        const ai = new EnemyAi(this.scene)
        const enemies = this.scene.board.unities.filter(unit => unit.controller === 'enemy')
        for (const enemy of enemies) {
          const action = ai.chooseBestAction(enemy)
  
          if (!action) {
            console.log('no action for ' + enemy.name)
          } else {
            console.log(`goblin -> ${action.targetTile?.gridX},${action.targetTile?.gridY}`)
            await enemy.executeAction(action)
          }
        }

        return
      case 'Player Planning': return
      case 'Do Actions': return
    }
  }

}