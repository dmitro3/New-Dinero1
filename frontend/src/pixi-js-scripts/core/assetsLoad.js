/* eslint-disable no-undef */
'use client'; // Ensures this code runs only on the client side

import { path } from '../settings.js';

let assetsLoaded = false;

async function loadAssets() {
  if (assetsLoaded) {
    console.log('Assets are already loaded.');
    return;
  }

  try {
    PIXI.Assets.addBundle('Images', {
      wheel: `${path.imagePath}/wheel.png`,
      marker: `${path.imagePath}/marker.png`,
      sc: `${path.imagePath}/rewardCash.png`,
      gc: `${path.imagePath}/rewardCoin.png`,
      banner: `${path.imagePath}/banner.png`,
      claim: `${path.imagePath}/claim.png`,
      button: `${path.imagePath}/button.png`,
    });

    await PIXI.Assets.loadBundle('Images');
    assetsLoaded = true;

    console.log('Assets loaded successfully.');
  } catch (error) {
    console.error('Error loading Pixi assets:', error);
    throw error;
  }
}

export default loadAssets;
