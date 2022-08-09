import { IsometricSprite } from "./objs/IsometricSprite";
import { Unit } from "./objs/Unit";

export function createSpriteMovementAnimation(
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
        if (newDepth > currentDepth) return
        sprite.depth = newDepth + 1
      },
      onComplete: () => {
        sprite.depth = newDepth + 1
      },
      duration,
    })
    previousDepth = currentDepth
  }
  return timeline
}

export type PalleteConfig = {
  paletteKey: string,                         // Palette file we're referencing.
  paletteNames: string[],   // Names for each palette to build out the names for the atlas.
  spriteSheet: {                                      // Spritesheet we're manipulating.
    key: string,
    frameWidth: number,                                 // NOTE: Potential drawback. All frames are the same size.
    frameHeight: number,
  },
  animations: {
    key: string,
    frameRate: number,
    startFrame: number,
    endFrame: number,
    repeat?: number,
  }[]
}

export function createPallete(game: Phaser.Scene, config: PalleteConfig) {
  const colorLookup: Record<string, Phaser.Display.Color[]> = {};
  let x, y;
  let pixel, palette;
  const paletteWidth = game.textures.get(config.paletteKey).getSourceImage().width;

  // Go through each pixel in the palette image and add it to the color lookup.
  for (y = 0; y < config.paletteNames.length; y++) {
    palette = config.paletteNames[y];
    colorLookup[palette] = [];

    for (x = 0; x < paletteWidth; x++) {
      pixel = game.textures.getPixel(x, y, config.paletteKey);
      colorLookup[palette].push(pixel);
    }
  }

  // Create sheets and animations from base sheet.
  var sheet = game.textures.get(config.spriteSheet.key).getSourceImage() as HTMLCanvasElement;
  var atlasKey, anim, animKey;
  var canvasTexture, canvas, context, imageData, pixelArray;

  // Iterate over each palette.
  for (y = 0; y < config.paletteNames.length; y++) {
    palette = config.paletteNames[y];
    atlasKey = config.spriteSheet.key + '-' + palette;

    // Create a canvas to draw new image data onto.
    canvasTexture = game.textures.createCanvas(config.spriteSheet.key + '-temp', sheet.width, sheet.height);
    canvas = canvasTexture.getSourceImage() as HTMLCanvasElement;
    context = canvas.getContext('2d')!;

    // Copy the sheet.
    context.drawImage(sheet, 0, 0);

    // Get image data from the new sheet.
    imageData = context.getImageData(0, 0, sheet.width, sheet.height);
    pixelArray = imageData.data;

    // Iterate through every pixel in the image.
    for (var p = 0; p < pixelArray.length / 4; p++) {
      var index = 4 * p;

      var r = pixelArray[index];
      var g = pixelArray[++index];
      var b = pixelArray[++index];
      var alpha = pixelArray[++index];

      // If this is a transparent pixel, ignore, move on.
      if (alpha === 0) {
        continue;
      }

      // Iterate through the colors in the palette.
      for (var c = 0; c < paletteWidth; c++) {
        var oldColor = colorLookup[config.paletteNames[0]][c];
        var newColor = colorLookup[palette][c];

        // If the color matches, replace the color.
        if (r === oldColor.red && g === oldColor.green && b === oldColor.blue && alpha === 255) {
          pixelArray[--index] = newColor.blue;
          pixelArray[--index] = newColor.green;
          pixelArray[--index] = newColor.red;
        }
      }
    }

    // Put our modified pixel data back into the context.
    context.putImageData(imageData, 0, 0);

    // Add the canvas as a sprite sheet to the game.
    game.textures.addSpriteSheet(atlasKey, canvasTexture.getSourceImage() as HTMLImageElement, {
      frameWidth: config.spriteSheet.frameWidth,
      frameHeight: config.spriteSheet.frameHeight,
    });

    // Iterate over each animation.
    for (var a = 0; a < config.animations.length; a++) {
      anim = config.animations[a];
      animKey = atlasKey + '-' + anim.key;

      // Add the animation to the game.
      game.anims.create({
        key: animKey,
        frames: game.anims.generateFrameNumbers(atlasKey, { start: anim.startFrame, end: anim.endFrame }),
        frameRate: anim.frameRate,
        repeat: anim.repeat === undefined ? -1 : anim.repeat
      });
    }

    // // Destroy temp texture.
    game.textures.get(config.spriteSheet.key + '-temp').destroy();
  }

  // Destroy textures that are not longer needed.
  // NOTE: This doesn't remove the textures from TextureManager.list.
  //       However, it does destroy source image data.
  game.textures.get(config.spriteSheet.key).destroy();
  game.textures.get(config.paletteKey).destroy();
}
