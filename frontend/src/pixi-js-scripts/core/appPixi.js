/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
import { settings } from '../settings.js';

const createPixiApp = () => {
  const app = new PIXI.Application({
    width: settings.originalWidth,
    height: settings.originalHeight,
    backgroundColor: settings.backgroundColor,
    antialias: true,
    // resolution: window.devicePixelRatio,
    backgroundAlpha: settings.backgroundAlpha
  });
  globalThis.__PIXI_APP__ = app;

  const div = settings.div();
  if (div) {
    div.appendChild(app.view);
  }

  const destroyPixiApp = () => app.destroy(true);

  const appTransform = (x, y) => {
    app.renderer.resize(x, y);
  };

  // appTransform(700, 500)
  return {
    app: app,
    destroyPixi: destroyPixiApp,
    resizePixiApp: appTransform
  };
};

export default createPixiApp;
