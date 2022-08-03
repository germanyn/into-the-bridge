import { BOARD_SIZE } from "../constants"
import { IsometricSprite, SpriteParams } from "./IsometricSprite"
import { PathFinding } from "./path-finding/PathFinding"
import { PathNode } from "./path-finding/PathNode"
import { OutlinePipeline } from "./shaders/OutlinePipeline"
import { Tile } from "./tiles/Tile"

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

  constructor(textureName: string, spriteParams: SpriteParams, {
    baseLife = 0,
    baseMovement = 0,
  }: UnitParams = {}) {
    super(textureName, spriteParams)
    this.baseLife = baseLife
    this.baseMovement = baseMovement
    this.adjustDepth()
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

  get paths() {
    const maxDistance = this.baseMovement
    const pathFinding = this.pathFinding
    const paths: PathNode[][] = []
    for (let x = this.gridX - maxDistance; x < this.gridX + maxDistance + 1; ++x) {
      for (let y = this.gridY - maxDistance; y < this.gridY + maxDistance + 1; ++y) {
        if (x < 0 || x > BOARD_SIZE - 1 || y < 0 || y > BOARD_SIZE - 1) continue
        const tile = this.scene.map.floors[x]?.[y]
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
      return this.scene.map.getPathTile(path) === tile
    })
    if (!path) return false
    this.scene.events.emit('deselect-all')
    const timeline = this.scene.tweens.createTimeline()
    const [firstNode, ...otherNodes] = path
    let previousTile = this.scene.map.floors[firstNode.x][firstNode.y]
    for (const node of otherNodes) {
      const currentTile = previousTile
      const toTile = this.scene.map.floors[node.x][node.y]
      const animationPath = new Phaser.Curves.Path(this.x, this.y)
      const [newX, newY] = this.scene.calculateTilePosition(node.coordinates)
      animationPath.lineTo(newX + this.offsetX, newY + this.offsetY)
      timeline.add({
        targets: this,
        x: newX + this.offsetX,
        y: newY + this.offsetY,
        onStart: () => {
          this.adjustDepth()
          if (!currentTile || toTile.depth < currentTile.depth ) return
          this.depth = toTile.depth +1
        },
        onComplete: () => {
          this.depth = toTile.depth + 1
        },
        duration: 125,
      })
      previousTile = toTile
    }
    timeline.once(Phaser.Tweens.Events.TIMELINE_COMPLETE, () => {
      this.currentTile?.removeUnit()
      tile.addUnit(this)
    })
    timeline.play()
    return true
  }


  get pathFinding() {
    const pathFinding = new PathFinding(BOARD_SIZE, BOARD_SIZE)
    this.scene.map.floors.forEach((row, x) => {
      row.forEach((tile, y) => {
        pathFinding.grid[x][y].isWalkable = tile.isWalkableBy(this)
      })
    })
    return pathFinding
  }
  get currentTile() {
    return this.scene.map.floors
      .flatMap(row => row)
      .find(tile => tile?.unit === this)
  }
}