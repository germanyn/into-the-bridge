import { PathNode } from "./PathNode";

export class PathFinding {
  static MOVE_STRAIGHT_COST = 1
  grid: PathNode[][] = []

  constructor(width: number, height: number) {
    this.grid = Array.from(Array(width), (_, x) => {
      return Array.from(Array(height), (_, y) => new PathNode([x, y]))
    })
  }

  findPath([startX, startY]: [number, number], [endX, endY]: [number, number]): PathNode[] {
    const startNode = this.grid.at(startX)?.at(startY)
    if (!startNode) throw new Error(`No starting node for ${startX},${startY}`)

    const endNode = this.grid.at(endX)?.at(endY)
    if (!endNode) throw new Error(`No ending node for ${endX},${endY}`)

    let openNodes: PathNode[] = [startNode]
    const closedNodes: PathNode[] = []
  
    this.grid.forEach(row => {
      row.forEach(node => {
        node.gCost = Infinity
        node.cameFrom = undefined
      })
    })
    startNode.gCost = 0
    startNode.hCost = this.calculateDistanceCost(startNode, endNode)
  
    while (openNodes.length > 0) {
      const currentNode = this.getLowerFCostNode(openNodes)
      if (currentNode === endNode) return this.calculatePath(endNode)
      openNodes = openNodes.filter(node => node !== currentNode)
      closedNodes.push(currentNode)
      this.getNodeNeighbours(currentNode).forEach(node => {
        if (closedNodes.includes(node)) return
        if (!node.isWalkable) {
          closedNodes.push(node)
          return
        }

        const tentativeGCost = currentNode.gCost + this.calculateDistanceCost(currentNode, node)
        if (tentativeGCost >= node.gCost) return
        node.cameFrom = currentNode
        node.gCost = tentativeGCost
        node.hCost = this.calculateDistanceCost(node, endNode)
        if (openNodes.includes(node)) return
        openNodes.push(node)
      })
    }

    return []
  }

  hasPath(startPoint: [number, number], endPoint: [number, number]) {
    return this.findPath(startPoint, endPoint).length > 1
  }

  private getNodeNeighbours(node: PathNode) {
    return [
      [node.coordinates[0], node.coordinates[1] - 1], // UP
      [node.coordinates[0], node.coordinates[1] + 1], // DOWN
      [node.coordinates[0] - 1, node.coordinates[1]], // LEFT
      [node.coordinates[0] + 1, node.coordinates[1]], // RIGHT
    ].map(([x, y]) => this.grid[x]?.[y])
      .filter(Boolean)
  }

  private calculatePath(endNode: PathNode): PathNode[] {
    const path = [endNode]
    let currentNode = endNode
    while (currentNode.cameFrom) {
      path.push(currentNode.cameFrom)
      currentNode = currentNode.cameFrom
    }
    return [...path].reverse();
  }

  private calculateDistanceCost(a: PathNode, b: PathNode) {
    const xDistance = Math.abs(a.coordinates[0] - b.coordinates[0])
    const yDistance = Math.abs(a.coordinates[1] - b.coordinates[1])
    const remaining = Math.abs(xDistance - yDistance)
    return PathFinding.MOVE_STRAIGHT_COST * remaining
  }

  private getLowerFCostNode(nodes: PathNode[]): PathNode {
    let lowesCostNode = nodes[0]
    nodes.slice(1).forEach(node => {
      if (lowesCostNode.fCost <= node.fCost) return
      lowesCostNode = node
    })
    return lowesCostNode
  }
}