import { Math } from "phaser"

export class PathNode {
  gCost: number = Infinity
  hCost: number = Infinity
  isWalkable = true
  cameFrom?: PathNode

  constructor(public coordinates: [number, number]) {}

  get fCost() {
    return this.gCost + this.hCost
  }

  get x() {
    return this.coordinates[0]
  }
  get y() {
    return this.coordinates[1]
  }

  get point(): Math.Vector2 {
    return new Math.Vector2(this.x, this.y)
  }
}