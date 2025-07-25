/* eslint-disable no-undef */
'use client';
import { pixiApp } from './initializePixi';
import { aspectRatio } from '../settings.js';
import { GAME_STATES, getSpinWheelResult, resetWheel, setupWheelValues, spinSuspend, wheelState } from './gameLogic.js';
import { spriteSet } from './utility.js';
import { getStateAndDispatch } from '@/store';

let uiCreated = false;

const containers = {
  rootContainer: null,
  bgContainer: null,
  wheelContainer: null,
  bannerContainer: null
};

const gameAssets = {
  wheel: null,
  marker: null,
  banner: null,
  claim: null,
  coinText: null,
  cashText: null,
  button: null
};

let scIcon = [];
let gcIcon = [];

async function createUI() {
  setupContainers();
  setupGameAssets();
  uiCreated = true;
}


function setupContainers() {
  containers.rootContainer = new PIXI.Container();
  containers.bgContainer = new PIXI.Container();
  containers.wheelContainer = new PIXI.Container();
  containers.bannerContainer = new PIXI.Container();
  
  pixiApp.app.stage.position.set(pixiApp.app.view.width / 2, pixiApp.app.view.height / 2);
  pixiApp.app.stage.addChild(containers.rootContainer);
  containers.rootContainer.addChild(containers.bgContainer);
}

async function setupGameAssets() {
  setupWheel();
  setupMarker();
  setupButton();
  const wheelContentValues = await getStateAndDispatch().getState().wheelConfig;
  if(wheelContentValues)
  for (let num = 0; num < wheelContentValues.sc.length; num++) {
    if (wheelContentValues.sc[num] && wheelContentValues.sc[num] !== 0) setupSC(num, true,wheelContentValues);
    if (wheelContentValues.gc[num] && wheelContentValues.gc[num] !== 0) setupGC(num, true,wheelContentValues);
  }
  setupWheelValues(wheelContentValues);
  // setupReward();
  resetWheel();
}

function setupWheel() {
  gameAssets.wheel = new PIXI.Sprite();
  gameAssets.wheel = spriteSet(gameAssets.wheel, PIXI.Assets.get('wheel'), containers.bgContainer);
  gameAssets.wheel.scale.set(aspectRatio);
  gameAssets.wheel.interactive = true;
  gameAssets.wheel.on('pointerdown', () => {});
  gameAssets.wheel.addChild(containers.wheelContainer);
}

function setupButton() {
  gameAssets.button = new PIXI.Sprite();
  gameAssets.button = spriteSet(gameAssets.button, PIXI.Assets.get('button'), containers.bgContainer);
  gameAssets.button.scale.set(aspectRatio);
  gameAssets.button.y = 50;
  gameAssets.button.alpha = 0;
  gameAssets.button.interactive = true;
  gameAssets.marker.addChild(gameAssets.button);
  gameAssets.button.on('pointerdown', () => {
    if (wheelState === GAME_STATES.IDLE) {
      setTimeout(() => {
        spinSuspend();
        // startSound();
        getSpinWheelResult();
      }, 100);
    }
  });
}

//call it to update text values
// export function updateWheelContent() {
//   const wheelContentValues = getStateAndDispatch().getState().wheelConfig;
// 	console.log('TCL: updateWheelContent -> wheelContentValues', wheelContentValues);
//   if(wheelContentValues)
//   for (let num = 0; num < wheelContentValues.sc.length; num++) {
//     if (wheelContentValues.sc[num] && wheelContentValues.sc[num] !== 0) {
//       scIcon[num].renderable = true;
//       scTextUI[num].text = wheelContentValues.sc[num];
//     } else {
//       scTextUI[num].text = '';
//       scIcon[num].renderable = false;
//     }
//     if (wheelContentValues.gc[num] && wheelContentValues.gc[num] !== 0) {
//       gcIcon[num].renderable = true;
//       gcTextUI[num].text = wheelContentValues.gc[num];
//     } else {
//       gcIcon[num].renderable = false;
//       gcTextUI[num].text = '';
//     }
//   }
// }

function setupMarker() {
  gameAssets.marker = new PIXI.Sprite();
  gameAssets.marker = spriteSet(gameAssets.marker, PIXI.Assets.get('marker'), containers.bgContainer);
  gameAssets.marker.scale.set(aspectRatio);
  // if (!uiCreated) {
    gameAssets.marker.y = gameAssets.marker.y - 22 * aspectRatio;
  // }
}

function setupSC(num, render = false,wheelContentValues) {
  let sprite = new PIXI.Sprite();
  sprite = spriteSet(sprite, PIXI.Assets.get('sc'), containers.wheelContainer);
  sprite.anchor.set(0.5);
  sprite.scale.set(0.45);
  sprite.pivot.y = 950;
  sprite.angle = (360 / wheelContentValues.sc.length) * num;
  scIcon.push(sprite);
  if (!render) scIcon[num].renderable = false;
}

function setupGC(num, render = false,wheelContentValues) {
  let sprite = new PIXI.Sprite();
  sprite = spriteSet(sprite, PIXI.Assets.get('gc'), containers.wheelContainer);
  sprite.anchor.set(0.5);
  sprite.scale.set(0.6);
  sprite.pivot.y = 970;
  sprite.angle = (360 / wheelContentValues.sc.length) * num;
  gcIcon.push(sprite);
  if (!render) gcIcon[num].renderable = false;
}

// function setupReward() {
//   gameAssets.banner = new PIXI.Sprite();
//   gameAssets.banner = spriteSet(gameAssets.banner, PIXI.Assets.get('banner'), containers.bgContainer);
//   gameAssets.banner.anchor.set(0.5);
//   gameAssets.banner.scale.set(1.1 * aspectRatio);
//   gameAssets.banner.addChild(containers.bannerContainer);
//   gameAssets.banner.alpha = 0;

//   let congratsText = new PIXI.Text('Congrats!!\n You have won ', {
//     fontFamily: 'Arial',
//     fontSize: 35,
//     fill: 0xf2d9ab,
//     align: 'center',
//     fontWeight: 'bolder',
//     dropShadow: true
//   });
//   congratsText.y = -100;
//   congratsText.anchor.set(0.5);
//   gameAssets.banner.addChild(congratsText);

//   gameAssets.cashText = new PIXI.Text('100 ', spinWheelSCSettings);
//   gameAssets.cashText.x = -10;
//   gameAssets.cashText.y = 15;
//   gameAssets.cashText.anchor.set(0.5);
//   gameAssets.banner.addChild(gameAssets.cashText);

//   let sprite = new PIXI.Sprite();
//   sprite = spriteSet(sprite, PIXI.Assets.get('gc'), gameAssets.banner);
//   sprite.anchor.set(0.5);
//   sprite.x = 35;
//   sprite.y = 65;
//   sprite.scale.set(0.3);

//   gameAssets.coinText = new PIXI.Text('100', spinWheelGCSettings);
//   gameAssets.coinText.x = -10;
//   gameAssets.coinText.y = 65;
//   gameAssets.coinText.anchor.set(0.5);
//   gameAssets.banner.addChild(gameAssets.coinText);

//   let sprite2 = new PIXI.Sprite();
//   sprite2 = spriteSet(sprite2, PIXI.Assets.get('sc'), gameAssets.banner);
//   sprite2.anchor.set(0.5);
//   sprite2.x = 35;
//   sprite2.y = 15;
//   sprite2.scale.set(0.3);

//   gameAssets.claim = new PIXI.Sprite();
//   gameAssets.claim = spriteSet(gameAssets.claim, PIXI.Assets.get('claim'), gameAssets.banner);
//   gameAssets.claim.anchor.set(0.5);
//   gameAssets.claim.y = 215;
//   gameAssets.claim.interactive = false;
// }


export { containers, gameAssets, createUI, uiCreated };
