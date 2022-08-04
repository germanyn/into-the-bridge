import Phaser from 'phaser';
import { BOARD_SIZE, CENTER_X, CENTER_Y, TILE_HEIGHT, TILE_HHEIGHT, TILE_HWIDTH, TILE_WIDTH } from '../constants';
import { Board } from '../objs/Board';
import { Goblin } from '../objs/Goblin';
import { Hero } from '../objs/Hero';
import { Pillar } from '../objs/Pillar';
import { OutlinePipeline } from '../objs/shaders/OutlinePipeline';
import { Tile } from '../objs/tiles/Tile';
import { Unit } from '../objs/Unit';

export const GAME_SCENE_KEY = 'GameScene'

export default class MainScene extends Phaser.Scene {
  board!: Board
  selectedUnit?: Unit
  attacking = false
  constructor() {
    super(GAME_SCENE_KEY);
  }

  init() {
    if (this.game.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
      this.game.renderer.pipelines.add(
        OutlinePipeline.KEY,
        new OutlinePipeline(this.game)
      )
    }
  }

  preload() {
    this.load.image('floor', 'assets/tavern/individual-floor-tiles/tavern-floor (1).png');
    this.load.image('hero', 'assets/hero/Individual Sprites/adventurer-idle-00.png');
    this.load.image('pillar', 'assets/tavern/individual-walls/tavern-walls (65).png');
    this.load.image('goblin', 'assets/goblin/tile008.png');
  }

  create() {
    this.events.addListener('select-tile', (tile: Tile) => {
      if (!tile.unit) return
      this.selectedUnit = tile.unit
      this.attacking = false
    })
    this.events.addListener('deselect-all', (tile: Tile) => {
      this.selectedUnit = undefined
      this.attacking = false
    })
    this.events.addListener('toggle-attack', () => {
      if (!this.selectedUnit) return
      this.attacking = true
      this.selectedUnit.toggleAttack()
    })
    this.board = new Board(this)
    this.add.existing(this.board)
    const unities = [
      new Hero({
        scene: this,
        x: 1,
        y: 2,
      }),
      new Pillar({
        scene: this,
        x: 3,
        y: 2,
      }),
      new Pillar({
        scene: this,
        x: 5,
        y: 4,
      }),
      new Goblin({
        scene: this,
        x: 1,
        y: 5,
      }),
    ]
    unities.forEach(unit => this.board.addUnit(unit))
  }

  get centerX(): number {
    return (this.renderer.width - BOARD_SIZE * TILE_WIDTH) / 2
  }

  get centerY(): number {
    return (this.renderer.height - BOARD_SIZE * TILE_HEIGHT) / 2
  }

  calculateTilePosition([gridX, gridY]: [number, number]): [number, number] {
    const tx = (gridX - gridY) * TILE_HWIDTH + CENTER_X + this.centerX
    const ty = (gridX + gridY) * TILE_HHEIGHT + CENTER_Y + this.centerY
    return [tx, ty]
  }
}
