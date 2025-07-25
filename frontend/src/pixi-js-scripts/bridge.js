'use client';
import * as corePixiInit from './core/initializePixi.js';

export const pixiApplicationInit = () => corePixiInit.init();

export const pixiAssetsLoad = () => corePixiInit.loadPixiAssets();

export const pixiApplicationDestroy = () => corePixiInit.destroyPixiApp();

export const enableAssetsPixi = () => corePixiInit.enableAssets();
