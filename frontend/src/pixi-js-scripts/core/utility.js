/* eslint-disable no-undef */
import { settings } from '../settings';

export function spriteSet (spriteName, textureName, containerName) {
  spriteName.texture = textureName;
  containerName.addChild(spriteName);
  spriteName.anchor.set(0.5);
  return spriteName;
}

export function animatedSpriteSet (
  arrayName,
  containerName,
  positionX = 0,
  positionY = 0,
  scaleX = 1,
  scaleY = 1,
  visible = true,
  alpha = 1
) {
  let sprite = new PIXI.AnimatedSprite(arrayName);
  containerName.addChild(sprite);
  sprite.position.set(positionX, positionY);
  sprite.scale.set(scaleX, scaleY);
  sprite.visible = visible;
  sprite.alpha = alpha;
  sprite.anchor.set(0.5);
  return sprite;
}

// Bg image will scale up or down to fill the background completely
export function backgroundScale(widthBG, heightBG) {
  let scale = 1;

  if (settings.originalWidth / widthBG < settings.originalHeight / heightBG) {
    scale = settings.originalHeight / heightBG;
  } else {
    scale = settings.originalWidth / widthBG;
  }

  return scale;
}


