/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import * as UI from './gameUI.js';
import { pixiApp } from './initializePixi.js';
import { spinWheelGCSettings, spinWheelSCSettings } from '../settings.js';
import { getStateAndDispatch } from '@/store/index.js';
import { getSpinWheelResultData } from '@/services/postRequest.js';

export const GAME_STATES = {
  IDLE: 'idle',
  SPIN: 'spin',
  SUSPENDED: 'suspended',
  INVISIBLE: 'invisible',
  STOPPING: 'stopping',
  STOP: 'stop',
  REWARDPOPUP: 'rewardpopUp',
};
let spinResult = {};

export const startSound = () => {
  // useSpinWheelStore.getState().setSpinWheelSound(true);
};

const stopSound = () => {
  // useSpinWheelStore.getState().setSpinWheelSound(false);
};

const playJackpotSound = () => {
  // useSpinWheelStore.getState().setJackpotSound(true);
  // setTimeout(() => useSpinWheelStore.getState().setJackpotSound(false), 3000);
};

export const getSpinWheelResult = async () => {
  try {
    await getSpinWheelResultData().then((response) => {
      if (response?.data?.message) {
        const index = response?.data?.index;
        const result = {
          showResult: true,
          index: response?.data?.index,
          gc: response?.data?.wheelConfiguration?.gc,
          sc: response?.data?.wheelConfiguration?.sc,
          bonusActivated: response?.data?.bonusActivated,
        };
        spinWheel(indexMapping(index));
        spinResult = result;
        // useSpinWheelStore.getState().setShowClose(false);
      }
    });
  } catch (e) {
    console.log('PIXI: result error', e);
  }
};

export const scTextUI = [];
export const gcTextUI = [];

const indexMapping = (i) => {
  let index = numberOfDiv - i;
  return index > numberOfDiv - 1 ? index - numberOfDiv : index;
};

// let numberOfDiv = wheelContentValues.sc.length;
let numberOfDiv = 16;
let stopPoint;
const maxTime = 600;
let timer = false;

export let wheelState = GAME_STATES.IDLE;
let wheelSpeed = 0;
let spinNumber = 0;
let rounds = 0;
let defaultWheelSpeed = 8;
const reversePull = 0.0445;

let points = [];
for (let i = 0; i < numberOfDiv; i++) {
  points[i] = (360 / numberOfDiv) * i;
}

export function setupWheelValues(wheelContentValues) {
  for (let num = 0; num < numberOfDiv; num++) {
    scTextUI[num] = new PIXI.Text(
      wheelContentValues.sc[num],
      spinWheelSCSettings
    );
    scTextUI[num].anchor.set(0.5);
    scTextUI[num].pivot.y = 373;
    scTextUI[num].angle = (360 / numberOfDiv) * num;
    UI.gameAssets.wheel.addChild(scTextUI[num]);
    if (wheelContentValues.sc[num] === 0) {
      scTextUI[num].text = '';
    }

    gcTextUI[num] = new PIXI.Text(
      wheelContentValues.gc[num],
      spinWheelGCSettings
    );
    gcTextUI[num].anchor.set(0.5);
    gcTextUI[num].pivot.y = 510;
    gcTextUI[num].angle = (360 / numberOfDiv) * num;
    UI.gameAssets.wheel.addChild(gcTextUI[num]);
    if (wheelContentValues.gc[num] === 0) {
      gcTextUI[num].text = '';
    }
  }
}

function spinWheel(index = undefined) {
  //TODO: SET STOP POINT HERE
  if (index || index === 0) stopPoint = index;
  else stopPoint = Math.floor(Math.random() * numberOfDiv);
  spinNumber = 0;
  rounds = 0;
  wheelState = GAME_STATES.SPIN;
}
export function spinSuspend() {
  wheelSpeed = 0;
  wheelState = GAME_STATES.SUSPENDED;
}

export function resetWheel() {
  UI.gameAssets.wheel.alpha = 1;
  UI.gameAssets.wheel.interactive = true;
  wheelState = GAME_STATES.IDLE;
}

//Callback function for result when the wheel stops
function wheelStop() {
  getStateAndDispatch().dispatch({type:'SET_SPIN_WHEEL_RESULT', payload: spinResult});
  // useSpinWheelStore.getState().setShowClose(true);
}
function showReward() {
  timer = true;
}
function timerCallback() {
  wheelState = GAME_STATES.INVISIBLE;
  wheelStop();
}

let elapsedTime = 0;

const startGameTicker = () => {
  pixiApp.app.ticker.add((delta) => {
    if (rounds >= 2) {
      rounds = 0;
      wheelState = GAME_STATES.STOPPING;
    }
    if (wheelState === GAME_STATES.IDLE) {
      if (UI.gameAssets.wheel.angle <= -360) {
        UI.gameAssets.wheel.angle = 0;
      } else UI.gameAssets.wheel.angle -= 0.2 * delta;
    } else if (wheelState === GAME_STATES.SUSPENDED) {
      if (UI.gameAssets.wheel.angle >= 360) {
        spinNumber += 1;
        UI.gameAssets.wheel.angle = 0;
      } else {
        if (wheelSpeed >= defaultWheelSpeed) {
          wheelSpeed = defaultWheelSpeed;
        } else wheelSpeed += 0.2 * delta;
        UI.gameAssets.wheel.angle += wheelSpeed * delta;
      }
    } else if (wheelState === GAME_STATES.SPIN) {
      if (UI.gameAssets.wheel.angle >= 360) {
        spinNumber += 1;
        UI.gameAssets.wheel.angle = 0;
      } else {
        if (wheelSpeed >= defaultWheelSpeed) {
          wheelSpeed = defaultWheelSpeed;
        } else wheelSpeed += 0.2 * delta;
        UI.gameAssets.wheel.angle += wheelSpeed * delta;
      }
      if (
        UI.gameAssets.wheel.angle >= points[stopPoint] - 5 &&
        UI.gameAssets.wheel.angle <= points[stopPoint] + 5
      ) {
        rounds = spinNumber;
      }
    } else if (wheelState === GAME_STATES.STOPPING) {
      if (UI.gameAssets.wheel.angle >= 360) UI.gameAssets.wheel.angle = 0;
      else {
        wheelSpeed -= reversePull * delta;
        UI.gameAssets.wheel.angle += wheelSpeed * delta;
        if (wheelSpeed <= 0.3) {
          wheelSpeed = 0.3;
          if (
            UI.gameAssets.wheel.angle >= points[stopPoint] - 0.5 &&
            UI.gameAssets.wheel.angle <= points[stopPoint] + 0.5
          ) {
            wheelState = GAME_STATES.STOP;
            stopSound();
            playJackpotSound();
          }
        }
      }
    } else if (wheelState === GAME_STATES.STOP) {
      UI.gameAssets.wheel.angle = points[stopPoint];
      showReward();
    } else if (wheelState === GAME_STATES.INVISIBLE) {
      UI.gameAssets.wheel.alpha >= 0
        ? (UI.gameAssets.wheel.alpha -= 0.15 * delta)
        : (wheelState = GAME_STATES.REWARDPOPUP);
      UI.gameAssets.marker.alpha >= 0
        ? (UI.gameAssets.marker.alpha -= 0.15 * delta)
        : (wheelState = GAME_STATES.REWARDPOPUP);
    }

    if (timer) {
      elapsedTime += 10 * delta;
      if (elapsedTime >= maxTime) {
        elapsedTime = 0;
        timer = false;
        timerCallback();
      }
    }
  });

  pixiApp.app.ticker.start();
};

const stopGameTicker = () => pixiApp.app.ticker.stop();

export { startGameTicker, stopGameTicker };
