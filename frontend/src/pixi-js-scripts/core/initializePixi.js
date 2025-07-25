'use client';
import loadAssets from './assetsLoad.js';
import createPixiApp from './appPixi.js';
import { startGameTicker } from './gameLogic.js';
import { createUI } from './gameUI.js';

 // Ensures this file is executed only on the client side

let currentPixiApp = null;
export let pixiApp;
// Dynamically load assets for Pixi
const loadAssetsPixi = async () => {
  try {
      await loadAssets();
      // await enableAssets();
  } catch (error) {
    console.error('Error during assets loading in Pixi:', error);
    throw error;
  }
};

// Dynamically load the Pixi application
const loadPixiApp = async () => {
  try {

    if (currentPixiApp) {
      await currentPixiApp.destroyPixi(true); // Destroy any existing app to prevent memory leaks
    }
    pixiApp = await createPixiApp();
    currentPixiApp = pixiApp;

    return pixiApp;
  } catch (error) {
    console.error('Error during Pixi.js initialization:', error);
    throw error;
  }
};

// Dynamically load the game UI
const loadGameUI = async () => {
  try {
      await createUI();
      console.log('Game UI initialized');
  } catch (error) {
    console.error('Error loading gameUI.js:', error);
    throw error;
  }
};

// Dynamically load and start the game ticker
const gameTickerStart = async () => {
  try {
      startGameTicker();
      console.log('Game logic initialized');
  } catch (error) {
    console.error('Error loading gameLogic.js:', error);
    throw error;
  }
};

// Load Pixi assets
export const loadPixiAssets = async () => {
  try {
    await loadAssetsPixi();
    console.log('Pixi assets loaded successfully');
  } catch (error) {
    console.error('Error loading Pixi assets:', error);
  }
};

// Destroy the current Pixi app
export const destroyPixiApp = () => {
  if (currentPixiApp) {
    currentPixiApp.destroyPixi(true); // Ensure all resources are cleaned up
    currentPixiApp = null;
    console.log('Pixi app destroyed');
  }
};

// Initialize Pixi by loading assets
export const init = async () => {
  try {
    await loadAssetsPixi();
    console.log('Pixi assets initialized');
  } catch (error) {
    console.error('Error during Pixi initialization:', error);
  }
};

// Enable assets, load the Pixi app, game UI, and game ticker
export const enableAssets = async () => {
  try {
    await init();
    await loadPixiApp(); // Initialize Pixi app
    await loadGameUI(); // Load game UI
    await gameTickerStart(); // Start game logic ticker
    console.log('Pixi and game assets fully enabled');
  } catch (error) {
    console.error('Error during Pixi load:', error);
  }
};