const WIDTH = 480;
const HEIGHT = 320;
const APP_FPS = 60;

// stats
let stats = new Stats();
console.log(stats);
stats.showPanel(0); // 0: fps, 1: ms; 2: mb, 3: custom
document.body.appendChild(stats.dom);

// init
let app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});
let canvas = document.getElementById("canvas");
canvas.appendChild(app.view);
app.renderer.backgroundColor = 0x000000;
app.stage.interactive = true;
app.ticker.remove(app.render, app);
const fpsDelta = 60 / APP_FPS;

let elapsedTime = 0;
let bg;
let obj_0, obj_1, obj_2, obj_3;
let objAry = ["0", "1", "2", "3"];
let particles = [];
let particle;
let particlesEmitflag = true;
let title;

let container = new PIXI.Container();
container.width = 100;
container.height = 100;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
container.interactive = true;
container.interactiveChildren = true;
container.buttonMode = true;
app.stage.addChild(container);

let containerSp;

// asset property
const ASSET_BG = "images/pic_bg_carpet.jpg";
const ASSET_obj_0 = "images/pic_coin_0.png";
const ASSET_obj_1 = "images/pic_coin_1.png";
const ASSET_obj_2 = "images/pic_coin_2.png";
const ASSET_obj_3 = "images/pic_coin_3.png";
const ASSET_TITLE = "images/pic_ti_coins2.png";

// asset load
PIXI.loader.add("bg_data", ASSET_BG);
PIXI.loader.add("obj_0_data", ASSET_obj_0);
PIXI.loader.add("obj_1_data", ASSET_obj_1);
PIXI.loader.add("obj_2_data", ASSET_obj_2);
PIXI.loader.add("obj_3_data", ASSET_obj_3);
PIXI.loader.add("title_data", ASSET_TITLE);
PIXI.loader.load(onAssetsLoaded);

/**
 * Asset load Complete Callback
 * @param { object } loader object
 * @param { object } res asset data
 */
function onAssetsLoaded(loader, res) {
  console.log("onAssetsLoaded()");

  // BG
  bg = new PIXI.Sprite(res.bg_data.texture);
  container.addChild(bg);
  bg.x = 0;
  bg.y = 0;

  // TITLE
  title = new PIXI.Sprite(res.title_data.texture);
  container.addChild(title);
  title.scale.x = title.scale.y = 0.75;
  title.x = WIDTH / 2 - title.width / 2;
  title.y = HEIGHT - title.height - 40;

  // coin
  obj_0 = res.obj_0_data.texture;
  obj_1 = res.obj_1_data.texture;
  obj_2 = res.obj_2_data.texture;
  obj_3 = res.obj_3_data.texture;

  // container
  app.stage.on("pointerdown", onPointerDown);

  // Text
  let text = new PIXI.Text("Particle Effect Test 'Coin'\n(PixiJS 4.8.9)", {
    fontFamily: "Arial",
    fontSize: 30,
    fill: 0xffa500,
    align: "center",
    fontWeight: "bold",
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: false,
    dropShadowColor: "#666666",
    lineJoin: "round"
  });
  container.addChild(text);
  text.x = WIDTH / 2 - text.width / 2;
  text.y = 20;

  // Text2
  let text2 = new PIXI.Text("Click(Touch) the Stage", {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0xdc143c,
    align: "center",
    fontWeight: "bold",
    stroke: "#ffffff",
    strokeThickness: 5,
    dropShadow: false,
    dropShadowColor: "#666666",
    lineJoin: "round"
  });
  container.addChild(text2);
  text2.x = WIDTH / 2 - text2.width / 2;
  text2.y = HEIGHT - text2.height - 10;

  // Ticker
  let ticker = PIXI.ticker.shared;
  ticker.autoStart = false;
  ticker.stop();
  PIXI.settings.TARGET_FPMS = 0.06;
  app.ticker.add(tick);
}

/**
 * CLICK / TOUCH
 * @param { object } e
 */
let onPointerDown = e => {
  console.log("onPointerDown()", e);
  position = e.data.global;
  makeParticle(
    position.x, // x position
    position.y, // y position
    300, // number of particles
    60, // lifetime
    0.5, // gravity
    true, // random spacing
    6.28, // min angle
    0, // max angle
    20, // min size
    30, // max size
    10, // min speed
    20, // max speed
    0.005, // min scale speed
    0.01, // max scale speed
    // 0.02, // min alpha speed
    // 0.025, // max alpha speed
    0.005, // min rotation speed
    0.01 // max rotation speed
  );
};

/**
 * adjust fps
 * @param { number } delta time
 */
const tick = delta => {
  // console.log(delta);
  elapsedTime += delta;
  if (elapsedTime >= fpsDelta) {
    //enough time passed, update app
    update(elapsedTime);
    //reset
    elapsedTime = 0;
  }
};

/**
 * app rendering
 * @param { number } delta time
 */
const update = delta => {
  stats.begin();
  app.render();
  updateParticle();
  stats.end();
};

/**
 * A module that make particle
 * @export particleEffect
 * @param {number} [x=0] x position(default=0)
 * @param {number} [y=0] y position(default=0)
 * @param {number} [numberOfParticles=10] Maximum number of particles(default=10)
 * @param {number} [lifetime = 60] Particle lifetime
 * @param {number} [gravity=0] gravity(default=0)
 * @param {boolean} [randomSpacing=true] Should particles be random? To be evenly spaced?(default=true)
 * @param {number} [minAngle=0] Minimum angle(radian, default=0=→, 1.57=↓, 3.14=←, 4.712=↑, 6.28=→=0)
 * @param {number} [maxAngle=6.28] Maximum angle(radian, default=6.28=→=0)
 * @param {number} [minSize=4] Minimum size(default=4)
 * @param {number} [maxSize=16] Maximumsize(default=16)
 * @param {number} [minSpeed=0.1] Minimum speed(default=0.1)
 * @param {number} [maxSpeed=1] Maximum speed(default=1)
 * @param {number} [minScaleSpeed=0.01] Minimum scale change speed(default=0.01)
 * @param {number} [maxScaleSpeed=0.05] Maximum scale change speed(default=0.05)
 * @param {number} [minAlphaSpeed=0.02] Minimum alpha change speed(default=0.02)
 * @param {number} [maxAlphaSpeed=0.02] Maximum alpha change speed(default=0.02)
 * @param {number} [minRotationSpeed=0.01] Minimum rotation change speed(default=0.01)
 * @param {number} [maxRotationSpeed=0.03] Maximum rotation change speed(default=0.03)
 */
function makeParticle(
  x = 0,
  y = 0,
  numberOfParticles = 10,
  lifetime = 60,
  gravity = 0,
  randomSpacing = true,
  minAngle = 0,
  maxAngle = 3.14,
  minSize = 2,
  maxSize = 10,
  minSpeed = 0.2,
  maxSpeed = 1.5,
  minScaleSpeed = 0.05,
  maxScaleSpeed = 0.1,
  minAlphaSpeed = 0.1,
  maxAlphaSpeed = 0.2,
  minRotationSpeed = 0.02,
  maxRotationSpeed = 0.05
) {
  console.log("makeParticle()");
  if (!particlesEmitflag) {
    console.log("it is being generated ...");
    return;
  }
  particlesEmitflag = false;

  containerSp = new PIXI.Container();
  app.stage.addChild(containerSp);

  // helper function
  let randomFloat = (min, max) => min + Math.random() * (max - min);
  let randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  let angles = [];
  let angle;
  let spacing = (maxAngle - minAngle) / (numberOfParticles - 1);

  for (let i = 0; i < numberOfParticles; i++) {
    if (randomSpacing) {
      angle = randomFloat(minAngle, maxAngle);
      angles.push(angle);
    } else {
      if (angle === undefined) angle = minAngle;
      angles.push(angle);
      angle += spacing;
    }
  }

  angles.forEach(angle => make(angle));

  /**
   * Create individual particles
   * @param {number} angle
   */
  function make(angle) {
    console.log("make()");

    if (numberOfParticles <= particles.length) return;

    let num = randomInt(0, 2);
    let obj = Function('"use strict";return (' + `obj_${objAry[num]}` + ")")();

    let particle = new PIXI.Sprite(obj);
    containerSp.addChild(particle);

    // blendMode
    particle.blendMode = PIXI.BLEND_MODES.NORMAL; // ADD, SCREEN, MULTIPLY

    particle.x = x + randomInt(-50, 50);
    particle.y = y + randomInt(-50, 50);

    particle.gravity = gravity;

    let size = randomInt(minSize, maxSize);
    particle.width = size;
    particle.height = size;

    particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
    particle.alphaSpeed = randomFloat(minAlphaSpeed, maxAlphaSpeed);
    particle.rotationSpeed = randomFloat(minRotationSpeed, maxRotationSpeed);

    let speed = randomFloat(minSpeed, maxSpeed);
    particle.vx = speed * Math.cos(angle);
    particle.vy = speed * Math.sin(angle);

    particle.lifetime = lifetime;

    particles.push(particle);
    console.log("particle: ", particle);
    console.log("particles.length: ", particles.length);
  }
}

function removeParticle(...spritesToRemove) {
  console.log("removeParticle()");
  spritesToRemove.forEach(sprite => this.removeChild(sprite));
}

function removeChild(sprite) {
  sprite = null;
  particles.splice(sprite);
  console.log("removed, particles.length: ", particles.length);
  if (particles.length <= 0) {
    containerSp.destroy({ children: true, texture: false, baseTexture: false });
    app.stage.removeChild(containerSp);
    particlesEmitflag = true;
  }
}

function updateParticle() {
  for (let i = 0; i <= particles.length; i++) {
    let p = particles[i];

    if (p === undefined) break;

    p.vy += p.gravity;

    p.x += p.vx;
    p.y += p.vy;

    if (p.scaleX - p.scaleSpeed > 0) {
      p.scaleX -= p.scaleSpeed;
    }
    if (p.scaleY - p.scaleSpeed > 0) {
      p.scaleY -= p.scaleSpeed;
    }

    p.rotation += p.rotationSpeed;

    p.alpha -= p.alphaSpeed;

    p.lifetime -= 0.5;

    // if (p.alpha <= 0) {
    //  removeParticle(p);
    // }
    if (p.lifetime <= 0) {
      removeParticle(p);
    }
  }
}
