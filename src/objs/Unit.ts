import delay from 'delay'
import { GameObjects, Math } from "phaser"
import { BOARD_SIZE } from "../constants/board-constants"
import MainScene from "../scenes/GameScene"
import { LifeBar } from "./displays/LifeBar"
import { IsometricSprite, SpriteParams } from "./IsometricSprite"
import { PathNode } from "./path-finding/PathNode"
import { OutlinePipeline } from "./shaders/OutlinePipeline"
import { Tile } from "./tiles/Tile"
import { UnitAction } from "./UnitAction"
import { Weapon } from "./weapons/Weapon"

export type UnitParams = {
  baseLife?: number
  baseMovement?: number
}

export type ControllerType = 'none' | 'player' | 'enemy'

export abstract class Unit extends GameObjects.Container {
  declare scene: MainScene
  baseLife: number
  baseMovement: number
  controller: ControllerType = 'none'
  movedThisTurn = false
  attackedThisTurn = false
  life: number = 0
  canBePushed = true
  weapons: Weapon[] = []
  sprite: IsometricSprite
  lifeBar: LifeBar

  constructor(textureName: string, spriteParams: SpriteParams, {
    baseLife = 0,
    baseMovement = 0,
  }: UnitParams = {}) {
    super(spriteParams.scene)
    this.baseLife = baseLife
    this.baseMovement = baseMovement
    this.life = baseLife
    this.sprite = new IsometricSprite(textureName, spriteParams)
    this.x = this.sprite.x
    this.y = this.sprite.y
    this.sprite.x = 0
    this.sprite.y = 0
    this.add(this.sprite)
    this.scene.add.existing(this)
    this.depth = this.sprite.depth
    this.lifeBar = new LifeBar({
      scene: this.scene,
      x: 0,
      y: -16,
      current: this.life,
      max: this.baseLife,
    })
    this.add(this.lifeBar)
  }

  select() {
    this.sprite.setPipeline(OutlinePipeline.KEY)
    this.sprite.pipeline.set2f(
      "uTextureSize",
      this.sprite.texture.getSourceImage().width,
      this.sprite.texture.getSourceImage().height
    )
  }

  deselect() {
    this.sprite.resetPipeline()
  }

  get canMove() {
    return !this.movedThisTurn && !this.attackedThisTurn
  }

  get canAttack() {
    return !this.attackedThisTurn
  }

  get paths() {
    if (!this.canMove) return []
    const maxDistance = this.baseMovement
    const pathFinding = this.pathFinding
    const paths: PathNode[][] = []
    for (let x = this.gridX - maxDistance; x < this.gridX + maxDistance + 1; ++x) {
      for (let y = this.gridY - maxDistance; y < this.gridY + maxDistance + 1; ++y) {
        if (x < 0 || x > BOARD_SIZE - 1 || y < 0 || y > BOARD_SIZE - 1) continue
        const tile = this.scene.board.getTileAt([x, y])
        if (!tile) continue
        if (!tile.canBeOcupied(this)) continue
        const path = pathFinding.findPath([this.gridX, this.gridY], [x, y])
        if (!path.length) continue
        if (path.length -1 > maxDistance) continue
        paths.push(path)
      }
    }
    return paths
  }

  async moveToTile(tile: Tile): Promise<boolean> {
    const path = this.paths.find(path => {
      return this.scene.board.getPathTile(path) === tile
    })
    if (!path) return false
    const timeline = this.scene.tweens.createTimeline()
    const [firstNode, ...otherNodes] = path
    let previousTile = this.scene.board.getTileAt([firstNode.x, firstNode.y])
    for (const node of otherNodes) {
      const currentTile = previousTile
      const toTile = this.scene.board.getTileAt([node.x, node.y])
      if (!toTile) throw new Error(`Can't move to a tile that not exists`)
      const animationPath = new Phaser.Curves.Path(this.x, this.y)
      const [newX, newY] = this.scene.calculateTilePosition(node.coordinates)
      animationPath.lineTo(newX + this.offsetX, newY + this.offsetY)
      timeline.add({
        targets: this,
        x: newX + this.offsetX,
        y: newY + this.offsetY,
        onStart: () => {
          if (!currentTile || toTile.depth < currentTile.depth ) return
          this.depth = toTile.depth +1
        },
        onComplete: () => {
          this.depth = toTile.depth + 1
        },
        duration: 175,
      })
      previousTile = toTile
    }
    this.tile?.removeUnit()
    tile.addUnit(this)
    this.movedThisTurn = true
    return new Promise(resolve => {
      timeline.once(Phaser.Tweens.Events.TIMELINE_COMPLETE, () => {
        resolve(true)
      })
      timeline.play()
    })
  }


  get pathFinding() {
    return this.scene.board.buildUnitPathFinding(this)
  }

  get tile() {
    return this.scene.board.getUnitTile(this)
  }
  toggleAttack(weaponIndex: number) {
    if (!this.weapons.length) return
    if (!this.tile) return

    const weapon = this.weapons.at(weaponIndex)
    if (!weapon) throw new Error(`Unit has no weapon at ${weaponIndex}`)
    const tiles = weapon.getTargetArea(this.tile)
    if (!tiles.length) return false
    tiles.forEach(tile => tile.paintAttackableTile())
    return false
  }

  getWeaponTargets(weaponIndex: number): Tile[] {
    const weapon = this.weapons.at(weaponIndex)
    if (!weapon) return []
    if (!this.tile) return []
    if (!this.canAttack) return []
    return weapon.getTargetArea(this.tile)
  }

  async attack(weaponIndex: number, target: Tile): Promise<boolean> {
    const weapon = this.weapons.at(weaponIndex)
    if (!weapon) throw new Error(`No weapon at index ${weaponIndex}`)
    if (!this.tile) throw new Error(`Unit is not in the board`)
    const attacked = await weapon.attack(this.tile, target)
    if (!attacked) return false
    this.attackedThisTurn = true
    return true
  }

  async hurt(damage: number) {
    this.life = damage >= this.life
      ? 0
      : this.life - damage
    this.lifeBar.current = this.life
    this.lifeBar.draw()
    if (!this.life) await this.die()
  }
  async die() {
    return new Promise<void>(resolve => {
      this.scene.board.removeUnit(this)
      this.scene.tweens.addCounter({
        from: 1,
        to: 0,
        duration: 500,
        onUpdate: (tween) => {
          this.setAlpha(tween.getValue())
        },
        onComplete: () => {
          this.destroy()
          resolve()
        }
      })
    })
  }
  async push(direction: Phaser.Math.Vector2) {
    if (!this.tile) return
    if (!this.canBePushed) return
    const { gridX, gridY } = this.tile
    const toTile = this.scene.board.getTileAt([gridX + direction.x, gridY + direction.y])
    if (!toTile) return
    const tileOccupied = !!toTile.unit
    const oldPosition = new Phaser.Math.Vector2(this.x, this.y)
    const [newX, newY] = this.scene.calculateTilePosition([toTile.gridX, toTile.gridY])
    const timeline = this.scene.tweens.createTimeline()
    if (!tileOccupied) {
      timeline.add({
        targets: this,
        x: newX + this.offsetX,
        y: newY + this.offsetY,
        onStart: () => {
          if (!this.tile || toTile.depth < this.tile.depth ) return
          this.depth = toTile.depth + 1
        },
        duration: 250,
      })
    } else {
      const halfTileDirection = new Math.Vector2({ x: newX, y: newY })
        .normalize()
        .multiply({ x: -8, y: -8 })
        .rotate(Math.PI2 / 4)
      timeline.add({
        targets: this,
        x: newX + this.offsetX + halfTileDirection.x,
        y: newY + this.offsetY + halfTileDirection.y,
        onStart: () => {
          if (!this.tile || toTile.depth < this.tile.depth ) return
          this.depth = toTile.depth + 1
        },
        duration: 200,
      })
      timeline.add({
        targets: this,
        x: oldPosition.x,
        y: oldPosition.y,
        duration: 125,
        onComplete: () => {
          this.depth = toTile.depth + 1
        }
      })
    }
    return new Promise<void>(resolve => {
      timeline.once(Phaser.Tweens.Events.TIMELINE_COMPLETE, async () => {
        if (toTile.unit) {
          await Promise.all([
            toTile.unit.hurt(1),
            this.hurt(1),
          ])
        } else {
          this.tile?.removeUnit()
          toTile.addUnit(this)
        }
        resolve()
      })
      timeline.play()
    })
  }

  newTurn(): void {
    this.attackedThisTurn = false
    this.movedThisTurn = false
  }

  get gridX() {
    return this.sprite.gridX
  }

  get gridY() {
    return this.sprite.gridY
  }

  set gridX(value: this['sprite']['gridX']) {
    this.sprite.gridX = value
  }

  set gridY(value: this['sprite']['gridY']) {
    this.sprite.gridY = value
  }

  get offsetX() {
    return this.sprite.offsetX
  }

  get offsetY() {
    return this.sprite.offsetY
  }

  set offsetX(value: this['sprite']['offsetX']) {
    this.sprite.offsetX = value
  }

  set offsetY(value: this['sprite']['offsetY']) {
    this.sprite.offsetY = value
  }

  get point() {
    return this.sprite.point
  }

  get possibleActions(): UnitAction[] {
    const startTile = this.tile
    if (!startTile) throw new Error('Unit is not in the scene')

    const movementTiles = this.paths.map(path => {
      const endNode = path.at(-1)
      if (!endNode) throw new Error('No path end')

      const endTile = this.scene.board.getTileAt(endNode.point)
      if (!endTile) throw new Error('No tile for path end')

      return endTile
    })

    return [
      startTile,
      ...movementTiles,
    ].flatMap<UnitAction>(endTile => {
      const attackActions = this.weapons.flatMap<UnitAction>((weapon, index) => {
        return weapon.getTargetArea(endTile).map<UnitAction>(targetTile => {
          return new UnitAction({
            unit: this,
            team: this.controller,
            startTile,
            endTile,
            targetTile,
            weaponIndex: index,
            effects: weapon.getSkillEffect(endTile, targetTile),
          })
        })
      })
      return [
        ...attackActions,
        new UnitAction({
          unit: this,
          team: this.controller,
          startTile,
          endTile,
        })
      ]
    })
  }

  async executeAction(action: UnitAction) {
    await this.moveToTile(action.endTile)
    if (typeof action.weaponIndex === 'undefined' || !action.targetTile) return
    await this.attack(action.weaponIndex, action.targetTile)
  }
}