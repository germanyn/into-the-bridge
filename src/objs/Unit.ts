import { BOARD_SIZE } from "../constants"
import { IsometricSprite, SpriteParams } from "./IsometricSprite"
import { PathNode } from "./path-finding/PathNode"
import { OutlinePipeline } from "./shaders/OutlinePipeline"
import { Tile } from "./tiles/Tile"
import { Weapon } from "./weapons/Weapon"

export type UnitParams = {
  baseLife?: number
  baseMovement?: number
}

export type ControllerType = 'none' | 'player' | 'enemy'

export abstract class Unit extends IsometricSprite {
  selected = false
  baseLife: number
  baseMovement: number
  controller: ControllerType = 'none'
  movedThisTurn = false
  attackedThisTurn = false
  life: number = 0
  canBePushed = true
  weapons: Weapon[] = []

  constructor(textureName: string, spriteParams: SpriteParams, {
    baseLife = 0,
    baseMovement = 0,
  }: UnitParams = {}) {
    super(textureName, spriteParams)
    this.baseLife = baseLife
    this.baseMovement = baseMovement
    this.life = baseLife
  }
  select() {
    if (this.selected) return
    this.selected = true
    this.setPipeline(OutlinePipeline.KEY)
    this.pipeline.set2f(
      "uTextureSize",
      this.texture.getSourceImage().width,
      this.texture.getSourceImage().height
    )
  }

  deselect() {
    if (!this.selected) return
    this.selected = false
    this.resetPipeline()
  }

  get canMove() {
    return !this.movedThisTurn
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

  moveTo(tile: Tile): boolean {
    const path = this.paths.find(path => {
      return this.scene.board.getPathTile(path) === tile
    })
    if (!path) return false
    this.scene.events.emit('remove-tiles-paint')
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
        duration: 200,
      })
      previousTile = toTile
    }
    timeline.once(Phaser.Tweens.Events.TIMELINE_COMPLETE, () => {
      this.tile?.removeUnit()
      tile.addUnit(this)
    })
    timeline.play()
    this.movedThisTurn = true
    return true
  }


  get pathFinding() {
    return this.scene.board.buildUnitPathFinding(this)
  }

  get tile() {
    return this.scene.board.getUnitTile(this)
  }
  toggleAttack() {
    this.scene.events.emit('remove-tiles-paint')
    if (!this.weapons.length) return
    if (!this.tile) return

    const [weapon] = this.weapons
    const tiles = weapon.getTargetArea(this.tile)
    if (!tiles.length) return false
    tiles.forEach(tile => tile.paintAttackableTile())
    return false
  }

  get attackTiles(): Tile[] {
    if (!this.tile) return []
    if (!this.canAttack) return []
    return this.weapons[0].getTargetArea(this.tile)
  }

  attackTile(tile: Tile): boolean {
    this.scene.attacking = false
    this.scene.events.emit('remove-tiles-paint')
    if (!this.attackTiles.some(attackTile => attackTile === tile)) return false
    if (!tile.unit) return true
    this.weapons[0].getSkillEffect(this, tile).forEach(effect => {
      effect.apply()
    });
    return true
  }

  hurt(damage: number) {
    this.life = damage >= this.life
      ? 0
      : this.life - damage
    if (!this.life) this.die()
  }
  die() {
    this.scene.tweens.addCounter({
      from: 1,
      to: 0,
      duration: 300,
      onUpdate: (tween) => {
        this.setAlpha(tween.getValue())
      },
      onComplete: () => {
        this.tile?.removeUnit()
        this.destroy()
      }
    })
  }
  push(direction: Phaser.Math.Vector2) {
    if (!this.tile) return
    const { gridX, gridY } = this.tile
    const toTile = this.scene.board.getTileAt([gridX + direction.x, gridY + direction.y])
    if (!toTile) return
    const oldPosition = new Phaser.Math.Vector2(this.x, this.y)
    const [newX, newY] = this.scene.calculateTilePosition([toTile.gridX, toTile.gridY])
    this.scene.tweens.add({
      targets: this,
      x: newX + this.offsetX,
      y: newY + this.offsetY,
      onStart: () => {
        if (!this.tile || toTile.depth < this.tile.depth ) return
        this.depth = toTile.depth +1
      },
      onComplete: () => {
        if (toTile.unit) {
          this.setX(oldPosition.x)
          this.setY(oldPosition.y)
          toTile.unit.hurt(1)
          this.hurt(1)
        } else {
          this.depth = toTile.depth + 1
          this.tile?.removeUnit()
          toTile.addUnit(this)
        }
      },
      duration: 250,
    })
  }
}