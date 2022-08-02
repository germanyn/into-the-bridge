import Phaser, { GameObjects } from 'phaser';
import { Board } from '../objs/Board';
import { Hero } from '../objs/Hero';
import { Pillar } from '../objs/Pillar';
import { OutlinePipeline } from '../objs/shaders/OutlinePipeline';
import { Floor } from '../objs/tiles/Floor';
import { IsometricSprite } from '../objs/IsometricSprite';
import { Unit } from '../objs/Unit';

export default class MainScene extends Phaser.Scene {
  objsData = [
    [1,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,1,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [2,0,0,0,0,0],
  ]
  map!: Board
  constructor() {
    super('GameScene');
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
  }

  create() {
    this.renderScene()
  }

  renderScene() {
    this.map = new Board(this)
    this.objsData.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (!cell) return
        let unit: Unit
        switch (cell) {
          case 1:
            const hero = new Hero({
              scene: this,
              x,
              y,
            })
            unit = hero
            break;
          case 2:
            unit = new Pillar({
              scene: this,
              x,
              y,
            })
            break;
        
          default: throw new Error(`No sprite for ${cell}`)
        }
        this.map.addUnit(unit)
      })
    })
  }
}
