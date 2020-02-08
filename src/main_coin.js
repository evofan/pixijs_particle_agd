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
let particles = []; // 複数
let particle; // 単体
let particlesEmitflag = true; // 生成済みフラグ
let particleCount = 0; // 個数確認用

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

// asset load
PIXI.loader.add("bg_data", ASSET_BG);
PIXI.loader.add("obj_0_data", ASSET_obj_0);
PIXI.loader.add("obj_1_data", ASSET_obj_1);
PIXI.loader.add("obj_2_data", ASSET_obj_2);
PIXI.loader.add("obj_3_data", ASSET_obj_3);
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
    30, // number of particles
    60, // lifetime
    0.4, // gravity
    true, // random spacing
    6.28, // min angle
    0, // max angle
    20, // min size
    30, // max size
    1, // min speed
    2, // max speed
    0.005, // min scale speed
    0.01, // max scale speed
    // 0.02, // min alpha speed
    // 0.025, // max alpha speed
    // 1.0, // min alpha speed
    // 1.0, // max alpha speed
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
  x = 0, // x座標
  y = 0, // y座標
  numberOfParticles = 10, // パーティクル最大個数
  lifetime = 60,
  gravity = 0, // 重力
  randomSpacing = true, // パーティクル間をランダムにするか（true）？しない（その場合等間隔にする）か？
  minAngle = 0, // 最小角度
  maxAngle = 3.14, // 最大角度
  minSize = 2, // 最小サイズ
  maxSize = 10, // 最大サイズ
  minSpeed = 0.2, // 最小スピード
  maxSpeed = 1.5, // 最大スピード
  minScaleSpeed = 0.05, // 最小スケール変化スピード
  maxScaleSpeed = 0.1, // 最大スケール変化スピード
  minAlphaSpeed = 0.1, // 最小アルファ変化スピード
  maxAlphaSpeed = 0.2, // 最大アルファ変化スピード
  minRotationSpeed = 0.02, // 最小回転変化スピード
  maxRotationSpeed = 0.05 // 最大回転変化スピード
) {
  console.log("makeParticle()");
  if (!particlesEmitflag) {
    console.log("生成中なので抜け");
    return;
  }
  particlesEmitflag = false;

  containerSp = new PIXI.Container();
  app.stage.addChild(containerSp);

  // ランダム浮動小数点数とランダム整数のヘルパー関数
  let randomFloat = (min, max) => min + Math.random() * (max - min);
  let randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min; // 最大～最小間の数値を返す

  // 角度を保存する配列
  let angles = [];

  // 現在のパーティクルの角度を保存する変数
  let angle;

  // 各パーティクルを何ラジアン分離する必要があるかを把握する為の変数
  let spacing = (maxAngle - minAngle) / (numberOfParticles - 1);

  // 各パーティクルの角度値を作成し、その値を「angles」配列に格納する
  for (let i = 0; i < numberOfParticles; i++) {
    // 「randomSpacing」が「true」の場合、パーティクルに「minAngle」と「maxAngle」の間のどれかの角度値を指定する
    if (randomSpacing) {
      angle = randomFloat(minAngle, maxAngle);
      angles.push(angle);
    }
    //「randomSpacing」が「false」の場合、「minAngle」で始まり「maxAngle」で終わる各パーティクルを均等に配置する
    else {
      if (angle === undefined) angle = minAngle;
      angles.push(angle);
      angle += spacing;
    }
  }

  // 角度毎にパーティクルを作成する、★考え方：1つ1つの角度の値に対して、1個のパーティクルを作成する→それが集まって全体を構成する
  angles.forEach(angle => make(angle));

  /**
   * 個別のパーティクルを作成する
   * @param {number} angle
   */
  function make(angle) {
    console.log("make()");

    if (numberOfParticles <= particles.length) return;

    // パーティクル単体は、スプライト画像
    let num = randomInt(0, 2);
    let obj = Function('"use strict";return (' + `obj_${objAry[num]}` + ")")();

    let particle = new PIXI.Sprite(obj);
    containerSp.addChild(particle);

    // blendMode
    particle.blendMode = PIXI.BLEND_MODES.NORMAL;
    // particle.blendMode = PIXI.BLEND_MODES.ADD;
    // particle.blendMode = PIXI.BLEND_MODES.SCREEN;
    // particle.blendMode = PIXI.BLEND_MODES.MULTIPLY;

    // xとyの位置を設定する(中間点を算出)
    particle.x = x + randomInt(-50, 50);
    particle.y = y + randomInt(-50, 50);

    particle.gravity = gravity; // ここで渡しておく

    // ランダムな幅と高さを設定する
    let size = randomInt(minSize, maxSize); // 最小～最大間
    particle.width = size;
    particle.height = size;

    // ランダムな速度を設定して、スケール、アルファ、回転を変更します
    particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed); // 最小～最大間
    particle.alphaSpeed = randomFloat(minAlphaSpeed, maxAlphaSpeed); // 最小～最大間
    particle.rotationSpeed = randomFloat(minRotationSpeed, maxRotationSpeed); // 最小～最大間

    // パーティクルが移動するランダムな速度を設定します
    let speed = randomFloat(minSpeed, maxSpeed); // 最小～最大間
    particle.vx = speed * Math.cos(angle); // 速度xは角度のコサインにランダム値を乗算した物
    particle.vy = speed * Math.sin(angle); // 速度yは角度のサインにランダム値を乗算した物

    // ライフタイムの追加
    particle.lifetime = lifetime;

    // パーティクルを「particles」配列にプッシュする
    // "particles"配列は、フレーム毎にゲームループによって更新する必要がある
    particles.push(particle);
    console.log("particle: ", particle);
    console.log("■ particles.length: ", particles.length);
  }
}

function removeParticle(...spritesToRemove) {
  console.log("removeParticle()");
  spritesToRemove.forEach(sprite => this.removeChild(sprite));
}

// removeChild()メソッドを使用して配列からスプライトを削除する
function removeChild(sprite) {
  console.log("removeChild()");
  sprite = null;
  particles.splice(sprite);
  console.log("リムーブ完了", particles.length);
  console.log("■ particles.length: ", particles.length);
  if (particles.length <= 0) {
    containerSp.destroy({ children: true, texture: false, baseTexture: false });
    app.stage.removeChild(containerSp);
    particlesEmitflag = true;
  }
}

// （パーティクルの「update」メソッドは、ゲームループの各フレームで呼び出される）
function updateParticle() {
  for (let i = 0; i <= particles.length; i++) {
    // 重力を追加する、0なら変化無し

    let p = particles[i];

    if (p === undefined) break;

    // 重力を追加
    p.vy += p.gravity;

    // パーティクル移動する＝ベクトルを追加する
    p.x += p.vx;
    p.y += p.vy;

    // パーティクルのスケールを変化させる
    if (p.scaleX - p.scaleSpeed > 0) {
      p.scaleX -= p.scaleSpeed;
    }
    if (p.scaleY - p.scaleSpeed > 0) {
      p.scaleY -= p.scaleSpeed;
    }

    // パーティクルの回転を変更する
    p.rotation += p.rotationSpeed;

    // パーティクルのアルファを変更する
    p.alpha -= p.alphaSpeed;

    // パーティクルのライフタイムを設定
    p.lifetime -= 1;

    // 「アルファ」がゼロになったらパーティクルを削除する
    // ★考え方、lifetimeを設けてそれが0になったら削除（透過させない場合）するとか、★削除でなくてpoolに入れて再利用するとか
    // if (p.alpha <= 0) {
    //  removeParticle(p);
    // }
    if (p.lifetime <= 0) {
      removeParticle(p);
    }
  }
}
