
/* eslint-disable no-undef */
const basePath = '/assets/pixi-assets/';


export const path = {
  imagePath: basePath + 'images/',
  spriteSheetsPath: basePath + 'spriteSheets/'
};

export const settings = {
  originalWidth: 1000,
  originalHeight: 1000,
  backgroundColor: 0x00000,
  backgroundAlpha: 0,
  div: () => document.getElementById('pixi-spin-wheel')
};

export const spinWheelGCSettings = {
  fontFamily: 'Arial',
  fontSize: 48,
  fill: 0x201010,
  align: 'center',
  fontWeight: 'bolder'
};

export const spinWheelSCSettings = {
  fontFamily: 'Arial',
  fontSize: 36,
  fill: 0x201010,
  align: 'center',
  fontWeight: 'bolder'
};

export const aspectRatio = settings.originalWidth / 1550;
