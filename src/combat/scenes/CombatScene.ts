import delay from 'delay';
import Phaser from 'phaser';
import { BOARD_SIZE, CENTER_X, CENTER_Y, TILE_HEIGHT, TILE_HHEIGHT, TILE_HWIDTH, TILE_WIDTH } from '../constants/board-constants';
import { Board } from '../objs/Board';
import { IsometricSprite } from '../objs/IsometricSprite';
import { OutlinePipeline } from '../objs/shaders/OutlinePipeline';
import { Tile } from '../objs/tiles/Tile';
import { Turn } from '../objs/Turn';
import { Unit } from '../objs/units/Unit';
import { Pillar } from '../objs/units/buildings/Pillar';
import { Goblin } from '../objs/units/enemy/Goblin';
import { Archer } from '../objs/units/player/Archer';
import { Warrior } from '../objs/units/player/Warrior';
import { Wizard } from '../objs/units/player/Wizard';
import { createPallete } from '../utils';

export const GAME_SCENE_KEY = 'GameScene'

export default class CombatScene extends Phaser.Scene {
  board!: Board
  turn: Turn
  selectedUnit?: Unit
  selectedWeaponIndex?: number = undefined
  constructor() {
    super({
      key: GAME_SCENE_KEY,
      active: true,
    })
    this.turn = new Turn(this)
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
    this.load.setPath('assets')
    this.load.spritesheet('floor', 'tavern/tavern-floor.png', {
      frameWidth: 32,
      frameHeight: 16,
    });
    this.load.spritesheet('pit', 'tavern/pit.png', {
      frameWidth: 32,
      frameHeight: 16,
    });
    this.load.spritesheet('walls', 'tavern/tavern-walls.png', {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet('warrior', 'warrior/Idle.png', {
      frameWidth: 135,
    })
    this.load.spritesheet('goblin', 'goblin/Idle.png', {
      frameWidth: 150,
    })
    this.load.spritesheet('arrow', 'combat/Arrow.png', {
      frameWidth: 96,
    })
    this.load.spritesheet('archer', 'archer/Idle.png', {
      frameWidth: 100,
    })
    this.load.spritesheet('wizard', 'wizard/Idle.png', {
      frameWidth: 150,
    })
    this.load.spritesheet('small-fireball', 'fx/fireball/small-fireball.png', {
      frameWidth: 64,
    })
    this.load.spritesheet('explosion', 'fx/explosion/explosion_2.png', {
      frameWidth: 100,
    })
    this.load.spritesheet('airpush_D', 'fx/push/airpush_D.png', {
      frameWidth: 40,
      frameHeight: 32,
    })
    this.load.spritesheet('airpush_L', 'fx/push/airpush_L.png', {
      frameWidth: 40,
      frameHeight: 32,
    })
    this.load.spritesheet('airpush_R', 'fx/push/airpush_R.png', {
      frameWidth: 40,
      frameHeight: 32,
    })
    this.load.spritesheet('airpush_U', 'fx/push/airpush_U.png', {
      frameWidth: 40,
      frameHeight: 32,
    })
    this.load.image('archer-pallete', 'archer/pallete.png')
  }

  create() {
    console.log('passei aqui')
    this.anims.create({
      key: 'goblin-idle',
      frames: this.anims.generateFrameNames('goblin'),
      frameRate: 8,
      repeat: -1,
    })
    this.anims.create({
      key: 'warrior-idle',
      frames: this.anims.generateFrameNames('warrior'),
      frameRate: 12,
      repeat: -1,
    })
    this.anims.create({
      key: 'wizard-idle',
      frames: this.anims.generateFrameNames('wizard'),
      frameRate: 12,
      repeat: -1,
    })
    this.anims.create({
      key: 'fireball-idle',
      frames: this.anims.generateFrameNames('small-fireball'),
      frameRate: 60,
      repeat: -1,
    })
    this.anims.create({
      key: 'explosion-idle',
      frames: this.anims.generateFrameNames('explosion'),
      frameRate: 60,
    })
    this.anims.create({
      key: 'airpush_D-idle',
      frames: this.anims.generateFrameNames('airpush_D'),
      frameRate: 20,
    })
    this.anims.create({
      key: 'airpush_L-idle',
      frames: this.anims.generateFrameNames('airpush_L'),
      frameRate: 20,
    })
    this.anims.create({
      key: 'airpush_R-idle',
      frames: this.anims.generateFrameNames('airpush_R'),
      frameRate: 20,
    })
    this.anims.create({
      key: 'airpush_U-idle',
      frames: this.anims.generateFrameNames('airpush_U'),
      frameRate: 20,
    })
    createPallete(this, {
      paletteKey: 'archer-pallete',
      paletteNames: ['green', 'red', 'blue', 'yellow'],
      spriteSheet: {
        key: 'archer',
        frameHeight: 100,
        frameWidth: 100,
      },
      animations: [
        {
          key: 'idle',
          frameRate: 12,
          startFrame: 0,
          endFrame: 9,
          repeat: -1,
        },
      ]
    })

    this.events.addListener('select-tile', async (tile: Tile) => {
      this.events.emit('remove-tiles-paint')
      if (
        this.selectedUnit &&
        this.selectedUnit.getController() === 'player'
      ) {
        if (typeof this.selectedWeaponIndex === 'number') {
          const acted = await this.selectedUnit.attack(this.selectedWeaponIndex, tile)
          this.selectedWeaponIndex = undefined
          if (acted) {
            this.events.emit('unit-attacked', this.selectedUnit)
            return
          }
        } else {
          const acted = await this.selectedUnit.moveToTile(tile)
          if (acted) return
        }
      }
      this.events.emit('deselect-all')
      this.events.emit('detail-tile', tile)
      tile.select()
      this.selectedUnit = tile.unit
      this.board.paintMoves(tile)
    })
    this.events.addListener('toggle-attack', (weaponIndex: number) => {
      if (!this.selectedUnit) return
      this.events.emit('remove-tiles-paint')
      this.selectedWeaponIndex = weaponIndex
      this.selectedUnit.toggleAttack(weaponIndex)
    })
    this.events.addListener('background-click', () => {
      this.events.emit('deselect-all')
      this.selectedUnit = undefined
      this.selectedWeaponIndex = undefined
    })
    this.events.addListener('end-turn', () => {
      this.turn.start()
      this.events.emit('deselect-all')
    })
    this.board = new Board(this)
    this.add.existing(this.board)
    const unities = [
      new Archer({
        scene: this,
        x: 1,
        y: 2,
      }),
      new Warrior({
        scene: this,
        x: 1,
        y: 3,
      }),
      new Wizard({
        scene: this,
        x: 1,
        y: 4,
      }),
      new Goblin({
        scene: this,
        x: 6,
        y: 4,
      }),
      new Pillar({
        scene: this,
        x: 1,
        y: 7,
      }),
    ]
    unities.forEach(unit => this.board.addUnit(unit))
    delay(1000).then(() => {
      this.turn.start()
    })
  }

  get centerX(): number {
    return (this.renderer.width - BOARD_SIZE * TILE_WIDTH) / 2
  }

  get centerY(): number {
    return (this.renderer.height - BOARD_SIZE * TILE_HEIGHT) / 2
  }

  calculateTilePosition(point: [number, number] | Phaser.Math.Vector2): [number, number] {
    let gridX: number, gridY: number
    if (Array.isArray(point)) {
      ;[gridX, gridY] = point
    } else {
      gridX = point.x
      gridY = point.y
    }
    const posY = BOARD_SIZE - gridY - 1
    const tx = (gridX - posY) * TILE_HWIDTH + CENTER_X + this.centerX
    const ty = (gridX + posY) * TILE_HHEIGHT + CENTER_Y + this.centerY
    return [tx, ty]
  }
  createSpriteMovementAnimation(
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
          sprite.depth = newDepth + 0.5
        },
        onComplete: () => {
          sprite.depth = newDepth + 0.5
        },
        duration,
      })
      previousDepth = currentDepth
    }
    return timeline
  }
}
