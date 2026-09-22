"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  fetchLeaderboard,
  submitScore,
  getSavedName,
  storeName,
  sanitizeName,
  leaderboardEnabled,
  type LeaderboardEntry,
} from "@/lib/leaderboard";

type UiState = "ready" | "playing" | "paused" | "over" | "unsupported";

type Hud = {
  score: number;
  coins: number;
  best: number;
  speed: number;
  mult: number;
  shield: boolean;
  magnet: boolean;
  x2: boolean;
};

interface ObData {
  mesh: THREE.Mesh;
  lane: number;
  height: number;
  depth: number;
  active: boolean;
  kind: "box" | "bar" | "coin" | "power";
  variant?: "shield" | "magnet" | "x2";
  gaveBonus: boolean;
  boss?: boolean;
}

interface GameHandles {
  start: () => void;
  togglePause: () => void;
  resume: () => void;
  restart: () => void;
  jump: () => void;
  lane: (dir: -1 | 1) => void;
}

interface Particle {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  active: boolean;
  life: number;
  maxLife: number;
  vel: THREE.Vector3;
  grav: number;
  drag: number;
}

const LANE_X = [-3, 0, 3];
const PLAYER_HALF = 0.65;
const OB_DEPTH = 0.9;
const GRAVITY = 58;
const JUMP_V = 17.5;
const START_SPEED = 15;
const MAX_SPEED = 38;
const BEST_KEY = "paper-runner-best";

const COLORS = {
  bg: 0xf6f1e3,
  ink: 0x211f1a,
  accent: 0x3151c2,
  accent2: 0x203aa0,
  red: 0xcf4a33,
  faint: 0x9a9281,
  gold: 0xf2c14e,
  goldDark: 0xb97f1d,
  paper: 0xfdfaf0,
};

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function buildGame(
  host: HTMLElement,
  callbacks: {
    onUi: (s: UiState) => void;
    onHud: (h: Hud) => void;
    setHandles: (h: GameHandles) => void;
  }
): () => void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    throw new Error("webgl-unsupported");
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.bg, 40, 165);

  const camera = new THREE.PerspectiveCamera(
    62,
    host.clientWidth / host.clientHeight,
    0.1,
    900
  );
  camera.position.set(0, 5.6, 11);
  camera.lookAt(0, 1.4, -12);

  const skyCanvas = document.createElement("canvas");
  skyCanvas.width = 2;
  skyCanvas.height = 512;
  {
    const g = skyCanvas.getContext("2d");
    if (g) {
      const grad = g.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, "#dfe6f5");
      grad.addColorStop(0.55, "#eef0e0");
      grad.addColorStop(1, "#f6f1e3");
      g.fillStyle = grad;
      g.fillRect(0, 0, 2, 512);
    }
  }
  const skyTex = new THREE.CanvasTexture(skyCanvas);
  skyTex.colorSpace = THREE.SRGBColorSpace;
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 24, 18),
    new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false })
  );
  scene.add(sky);

  scene.add(new THREE.HemisphereLight(0xfff6e8, 0xb9c9e8, 0.9));
  const sun = new THREE.DirectionalLight(0xfff0d6, 2.2);
  sun.position.set(7, 14, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 7;
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 18;
  sun.shadow.camera.bottom = -8;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 60;
  sun.shadow.bias = -0.0004;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xbcd0ff, 0.5);
  rim.position.set(-9, 6, -8);
  scene.add(rim);
  const glow = new THREE.PointLight(0x3151c2, 6, 8, 2);
  glow.position.set(0, 3, 2);
  scene.add(glow);

  function makePaperTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const g = canvas.getContext("2d");
    if (!g) throw new Error("no 2d context");
    g.fillStyle = "#f3eddb";
    g.fillRect(0, 0, 512, 512);
    for (let x = 0; x < 512; x += 24) {
      for (let y = 0; y < 512; y += 24) {
        if ((x + y) % 3 === 0) {
          g.fillStyle = `rgba(140,120,80,${0.03 + Math.random() * 0.05})`;
          g.fillRect(x + Math.random() * 14, y + Math.random() * 14, 2, 2);
        }
      }
    }
    g.strokeStyle = "rgba(60,55,45,0.13)";
    g.lineWidth = 1;
    for (let y = 32; y < 512; y += 24) {
      g.beginPath();
      g.moveTo(0, y + 0.5);
      g.lineTo(512, y + 0.5);
      g.stroke();
    }
    g.strokeStyle = "rgba(207,74,51,0.22)";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(66, 0);
    g.lineTo(66, 512);
    g.stroke();
    g.fillStyle = "rgba(49,81,194,0.14)";
    g.fillRect(188, 16, 14, 14);
    g.fillRect(472, 196, 14, 14);
    g.fillRect(120, 404, 14, 14);
    g.strokeStyle = "rgba(60,55,45,0.18)";
    g.lineWidth = 2;
    g.beginPath();
    g.arc(320, 256, 60, 0, Math.PI * 2);
    g.stroke();
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 44);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const groundTex = makePaperTexture();
  const groundMat = new THREE.MeshStandardMaterial({
    map: groundTex,
    color: 0xffffff,
    roughness: 0.95,
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 320), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const laneLineMat = new THREE.MeshBasicMaterial({
    color: 0x3151c2,
    transparent: true,
    opacity: 0.08,
  });
  for (const x of LANE_X) {
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(0.05, 320),
      laneLineMat
    );
    line.rotation.x = -Math.PI / 2;
    line.position.set(x, 0.02, 0);
    scene.add(line);
  }

  const mountCanvas = document.createElement("canvas");
  mountCanvas.width = 1024;
  mountCanvas.height = 256;
  {
    const g = mountCanvas.getContext("2d");
    if (g) {
      const layer = (
        base: number,
        color: string,
        step: number,
        amp: number,
        seed: number
      ) => {
        g.fillStyle = color;
        g.beginPath();
        g.moveTo(0, 256);
        const n = 1024 / step;
        for (let i = 0; i <= n; i++) {
          const x = i * step;
          const y =
            base +
            Math.abs(Math.sin(seed + i * 0.7)) * amp +
            Math.random() * amp * 0.25;
          g.lineTo(x, y);
        }
        g.lineTo(1024, 256);
        g.closePath();
        g.fill();
      };
      layer(212, "#e9e4d0", 128, 30, 1.2);
      layer(176, "#d8dcc4", 160, 48, 4.1);
    }
  }
  const mountTex = new THREE.CanvasTexture(mountCanvas);
  mountTex.wrapS = THREE.RepeatWrapping;
  mountTex.colorSpace = THREE.SRGBColorSpace;
  const bandGeo = new THREE.PlaneGeometry(640, 64);
  const farBand = new THREE.Mesh(
    bandGeo,
    new THREE.MeshBasicMaterial({
      map: mountTex,
      fog: false,
      transparent: true,
      opacity: 0.95,
    })
  );
  farBand.position.set(0, 26, -185);
  scene.add(farBand);
  const nearBand = new THREE.Mesh(
    bandGeo,
    new THREE.MeshBasicMaterial({
      map: mountTex,
      fog: false,
      transparent: true,
      opacity: 0.5,
    })
  );
  nearBand.position.set(0, 20, -140);
  scene.add(nearBand);

  const sunCanvas = document.createElement("canvas");
  sunCanvas.width = 128;
  sunCanvas.height = 128;
  {
    const sg = sunCanvas.getContext("2d");
    if (sg) {
      const grad = sg.createRadialGradient(64, 64, 4, 64, 64, 64);
      grad.addColorStop(0, "rgba(255,240,200,0.95)");
      grad.addColorStop(0.5, "rgba(255,229,160,0.35)");
      grad.addColorStop(1, "rgba(255,229,160,0)");
      sg.fillStyle = grad;
      sg.fillRect(0, 0, 128, 128);
    }
  }
  const sunTex = new THREE.CanvasTexture(sunCanvas);
  sunTex.colorSpace = THREE.SRGBColorSpace;
  const sunDisc = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 36),
    new THREE.MeshBasicMaterial({
      map: sunTex,
      transparent: true,
      fog: false,
      depthWrite: false,
    })
  );
  sunDisc.position.set(40, 27, -236);
  scene.add(sunDisc);

  function makeScenery() {
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
    });
    for (let i = 0; i < 7; i++) {
      const cloud = new THREE.Group();
      for (let j = 0; j < 3; j++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.9 + Math.random() * 0.7, 12, 10),
          cloudMat
        );
        puff.position.set((j - 1) * 1.1, Math.random() * 0.3, 0);
        puff.scale.y = 0.55;
        cloud.add(puff);
      }
      cloud.position.set(
        (Math.random() < 0.5 ? -1 : 1) * (13 + Math.random() * 10),
        4.5 + Math.random() * 4,
        -40 - Math.random() * 110
      );
      scene.add(cloud);
      drifters.push({ group: cloud, speed: 0.28 + Math.random() * 0.12 });
    }
    for (let i = 0; i < 9; i++) {
      const note = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 1.4),
        new THREE.MeshBasicMaterial({
          color: Math.random() < 0.5 ? COLORS.paper : 0xfff1be,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
        })
      );
      note.geometry.translate(0, 0.35, 0);
      note.position.set(
        (Math.random() < 0.5 ? -1 : 1) * (8.5 + Math.random() * 5),
        1.6 + Math.random() * 2.2,
        -30 - Math.random() * 120
      );
      note.rotation.y = (Math.random() - 0.5) * 0.5;
      note.rotation.x = (Math.random() - 0.5) * 0.3 + 0.25;
      scene.add(note);
      drifters.push({ group: note, speed: 0.45 + Math.random() * 0.15 });
    }
    for (let i = 0; i < 10; i++) {
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.6 + Math.random() * 1.4, 8 + Math.random() * 10),
        new THREE.MeshBasicMaterial({
          color: 0x211f1a,
          transparent: true,
          opacity: 0.12,
        })
      );
      strip.position.set(
        (Math.random() < 0.5 ? -1 : 1) * (6.5 + Math.random() * 2.5),
        1 + Math.random() * 2.4,
        -120 - Math.random() * 90
      );
      strip.rotation.z = Math.random() < 0.5 ? -0.5 : 0.5;
      scene.add(strip);
      drifters.push({ group: strip, speed: 1 });
    }
  }
  const drifters: { group: THREE.Object3D; speed: number }[] = [];
  makeScenery();

  const playerMat = new THREE.MeshStandardMaterial({
    color: COLORS.accent,
    roughness: 0.55,
    metalness: 0.05,
  });
  const player = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 1.5, 1.25),
    playerMat
  );
  player.castShadow = true;
  const pupilMat = new THREE.MeshBasicMaterial({ color: COLORS.ink });
  const eyes: { eye: THREE.Mesh; pupil: THREE.Mesh; mat: THREE.MeshBasicMaterial }[] = [];
  for (const sx of [-0.29, 0.29]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    eye.position.set(sx, 0.18, 0.63);
    player.add(eye);
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 10, 10),
      pupilMat
    );
    pupil.position.set(sx, 0.16, 0.77);
    player.add(pupil);
    eyes.push({ eye, pupil, mat: eye.material as THREE.MeshBasicMaterial });
  }
  const browMat = new THREE.MeshBasicMaterial({ color: COLORS.ink });
  for (const sx of [-0.29, 0.29]) {
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.05), browMat);
    brow.position.set(sx, 0.5, 0.64);
    player.add(brow);
  }
  const footGeo = new THREE.BoxGeometry(0.34, 0.62, 0.4);
  const footMatL = new THREE.MeshStandardMaterial({ color: COLORS.accent2, roughness: 0.6 });
  const footMatR = new THREE.MeshStandardMaterial({ color: COLORS.red, roughness: 0.6 });
  const feet: { mesh: THREE.Mesh; phase: number }[] = [];
  for (const sx of [-0.3, 0.3]) {
    const foot = new THREE.Mesh(footGeo, sx < 0 ? footMatL : footMatR);
    foot.position.set(sx, -1.02, 0.12);
    foot.castShadow = true;
    player.add(foot);
    feet.push({ mesh: foot, phase: sx < 0 ? 0 : Math.PI });
  }
  scene.add(player);

  const shadowBlob = new THREE.Mesh(
    new THREE.CircleGeometry(0.85, 24),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.2,
    })
  );
  shadowBlob.rotation.x = -Math.PI / 2;
  shadowBlob.position.y = 0.01;
  scene.add(shadowBlob);

  const bubble = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 24, 18),
    new THREE.MeshBasicMaterial({
      color: COLORS.accent,
      transparent: true,
      opacity: 0.14,
    })
  );
  bubble.visible = false;
  scene.add(bubble);

  const particlePool: Particle[] = [];
  function getParticle(
    color: number,
    size: number,
    opacity: number,
    additive = false
  ): Particle | null {
    const entry = particlePool.find((p) => !p.active);
    if (entry) {
      entry.mat.color.setHex(color);
      entry.mat.opacity = opacity;
      entry.mat.blending = additive
        ? THREE.AdditiveBlending
        : THREE.NormalBlending;
      entry.mat.depthWrite = !additive;
      entry.mesh.scale.setScalar(size);
      entry.mesh.visible = true;
      return entry;
    }
    if (particlePool.length >= 160) return null;
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: !additive,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    mesh.visible = false;
    scene.add(mesh);
    const p: Particle = {
      mesh,
      mat,
      active: false,
      life: 0,
      maxLife: 1,
      vel: new THREE.Vector3(),
      grav: 0,
      drag: 0,
    };
    particlePool.push(p);
    return p;
  }
  function burst(
    center: THREE.Vector3,
    color: number,
    count: number,
    speed: number,
    size: number,
    life: number,
    grav = 22,
    spreadY = 4,
    additive = false
  ) {
    for (let i = 0; i < count; i++) {
      const p = getParticle(color, size, 1, additive);
      if (!p) continue;
      const theta = Math.random() * Math.PI * 2;
      const up = Math.random() * spreadY;
      const r = speed * (0.35 + Math.random() * 0.65);
      p.mesh.position.copy(center);
      p.vel.set(Math.cos(theta) * r, up, Math.sin(theta) * r);
      p.grav = grav;
      p.drag = 0.985;
      p.life = life * (0.6 + Math.random() * 0.4);
      p.maxLife = p.life;
      p.active = true;
    }
  }

  const boxMat = new THREE.MeshStandardMaterial({
    color: COLORS.red,
    roughness: 0.75,
  });
  const boxMat2 = new THREE.MeshStandardMaterial({
    color: COLORS.accent2,
    roughness: 0.75,
  });
  const boxMatInk = new THREE.MeshStandardMaterial({
    color: COLORS.ink,
    roughness: 0.8,
  });
  const boxGeo = new THREE.BoxGeometry(1.4, 1, OB_DEPTH);
  const barGeo = new THREE.BoxGeometry(10.2, 1.15, OB_DEPTH);
  const coinMat = new THREE.MeshStandardMaterial({
    color: COLORS.gold,
    roughness: 0.22,
    metalness: 0.75,
    emissive: COLORS.goldDark,
    emissiveIntensity: 0.25,
  });
  const coinGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.13, 22);
  const shieldMat = new THREE.MeshStandardMaterial({
    color: COLORS.accent,
    roughness: 0.3,
    metalness: 0.5,
    emissive: COLORS.accent,
    emissiveIntensity: 0.5,
  });
  const shieldGeo = new THREE.TorusGeometry(0.5, 0.11, 12, 26);
  const magnetMat = new THREE.MeshStandardMaterial({
    color: COLORS.gold,
    roughness: 0.25,
    metalness: 0.7,
    emissive: COLORS.gold,
    emissiveIntensity: 0.3,
  });
  const magnetGeo = new THREE.SphereGeometry(0.42, 20, 16);
  const pillarGeo = new THREE.BoxGeometry(0.5, 1.05, 0.5);

  const pool: ObData[] = [];
  const BOX_MATS = [boxMat, boxMat2, boxMatInk];

  function makeBox(lane: number, height: number, mat: THREE.Material): ObData {
    const mesh = new THREE.Mesh(boxGeo, mat);
    mesh.position.set(LANE_X[lane], height / 2, -90);
    mesh.visible = false;
    mesh.castShadow = true;
    scene.add(mesh);
    const ob: ObData = {
      mesh,
      lane,
      height,
      depth: OB_DEPTH,
      active: false,
      kind: "box",
      gaveBonus: false,
    };
    pool.push(ob);
    return ob;
  }
  function takeBox(
    lane: number,
    height: number,
    mat: THREE.Material
  ): ObData {
    for (const ob of pool) {
      if (!ob.active && ob.kind === "box") {
        ob.active = true;
        ob.lane = lane;
        ob.height = height;
        ob.gaveBonus = false;
        ob.mesh.material = mat;
        ob.mesh.scale.set(1, height, 1);
        ob.mesh.position.set(LANE_X[lane], height / 2, -90);
        ob.mesh.visible = true;
        return ob;
      }
    }
    return makeBox(lane, height, mat);
  }
  function takeBar(): ObData {
    for (const ob of pool) {
      if (!ob.active && ob.kind === "bar") {
        ob.active = true;
        ob.lane = -1;
        ob.gaveBonus = false;
        ob.mesh.position.z = -90;
        ob.mesh.visible = true;
        return ob;
      }
    }
    const mesh = new THREE.Mesh(
      barGeo,
      Math.random() < 0.5 ? boxMat : boxMat2
    );
    mesh.position.set(0, 1.15 / 2, -90);
    mesh.visible = false;
    mesh.castShadow = true;
    scene.add(mesh);
    const ob: ObData = {
      mesh,
      lane: -1,
      height: 1.15,
      depth: OB_DEPTH,
      active: false,
      kind: "bar",
      gaveBonus: false,
    };
    pool.push(ob);
    return ob;
  }
  function takeCoin(lane: number, y: number): ObData {
    for (const ob of pool) {
      if (!ob.active && ob.kind === "coin") {
        ob.active = true;
        ob.lane = lane;
        ob.gaveBonus = false;
        ob.mesh.position.set(LANE_X[lane], y, -90);
        ob.mesh.rotation.set(Math.PI / 2, 0, 0);
        ob.mesh.visible = true;
        return ob;
      }
    }
    const mesh = new THREE.Mesh(coinGeo, coinMat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(LANE_X[lane], y, -90);
    mesh.visible = false;
    mesh.castShadow = true;
    scene.add(mesh);
    const ob: ObData = {
      mesh,
      lane,
      height: 0.01,
      depth: 0.6,
      active: false,
      kind: "coin",
      gaveBonus: false,
    };
    pool.push(ob);
    return ob;
  }
  function takePower(
    lane: number,
    variant: NonNullable<ObData["variant"]>
  ): ObData {
    for (const ob of pool) {
      if (!ob.active && ob.kind === "power" && ob.variant === variant) {
        ob.active = true;
        ob.lane = lane;
        ob.gaveBonus = false;
        ob.mesh.position.set(LANE_X[lane], ob.mesh.position.y, -90);
        ob.mesh.visible = true;
        return ob;
      }
    }
    let mesh: THREE.Mesh;
    const y = 1.0;
    if (variant === "shield") {
      mesh = new THREE.Mesh(shieldGeo, shieldMat);
    } else if (variant === "magnet") {
      mesh = new THREE.Mesh(magnetGeo, magnetMat);
    } else {
      mesh = new THREE.Mesh(pillarGeo, magnetMat);
    }
    mesh.position.set(LANE_X[lane], y, -90);
    mesh.visible = false;
    mesh.castShadow = true;
    scene.add(mesh);
    const ob: ObData = {
      mesh,
      lane,
      height: 0.4,
      depth: 0.9,
      active: false,
      kind: "power",
      variant,
      gaveBonus: false,
    };
    pool.push(ob);
    return ob;
  }

  function recycle(ob: ObData) {
    ob.active = false;
    ob.gaveBonus = false;
    ob.mesh.visible = false;
  }

  const playerState = {
    lane: 1,
    x: 0,
    y: 0,
    vy: 0,
    grounded: true,
    squash: 0,
    run: 0,
    blink: 0,
    dying: false,
  };
  let mode: UiState = "ready";
  let speed = START_SPEED;
  let coins = 0;
  let score = 0;
  let spawnTimer = 1.0;
  let powerTimer = 8;
  let best = 0;
  try {
    best = Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    best = 0;
  }
  let combo = 1;
  let comboT = 0;
  let magnetT = 0;
  let x2T = 0;
  let invulnT = 0;
  let shieldActive = false;
  let hitStopT = 0;
  let shakeT = 0;
  let shakeMag = 0;
  let dustTimer = 0;
  let fovTimer = 0;

  const clock = new THREE.Timer();
  let raf = 0;
  let lastHud = "";
  const scorePos = new THREE.Vector3(0, 0.8, 0);

  function toast(text: string) {
    elToast.textContent = text;
    elToast.style.opacity = "1";
    elToast.style.transform = "translate(-50%, 0)";
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      elToast.style.opacity = "0";
      elToast.style.transform = "translate(-50%, 10px)";
    }, 1600);
  }
  const elToast = document.createElement("div");
  elToast.style.cssText =
    "position:absolute;left:50%;bottom:14%;transform:translate(-50%,10px);opacity:0;transition:opacity .35s ease,transform .35s ease;z-index:6;background:rgba(253,250,240,.9);border:2px solid rgba(43,40,34,.25);border-radius:9999px;padding:6px 18px;font-family:var(--font-caveat),cursive;font-size:22px;color:#211f1a;pointer-events:none;box-shadow:0 8px 24px -10px rgba(60,50,30,.4);white-space:nowrap";
  host.appendChild(elToast);
  let toastTimer = 0;

  let audioCtx: AudioContext | null = null;
  let muted = false;
  function tone(
    f0: number,
    f1: number,
    dur: number,
    type: OscillatorType,
    vol: number,
    delay = 0
  ) {
    if (muted) return;
    try {
      audioCtx = audioCtx || new AudioContext();
      if (audioCtx.state === "suspended") void audioCtx.resume();
      const t0 = audioCtx.currentTime + delay;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f0, t0);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch {
      /* audio unsupported */
    }
  }
  function sfxJump() {
    tone(320, 640, 0.14, "square", 0.06);
  }
  function sfxCoin() {
    tone(880, 1320, 0.1, "sine", 0.09);
    tone(1320, 1760, 0.1, "sine", 0.05, 0.05);
  }
  function sfxLand() {
    tone(150, 90, 0.09, "sine", 0.06);
  }
  function sfxPower() {
    tone(520, 1040, 0.18, "triangle", 0.09);
    tone(780, 1560, 0.2, "triangle", 0.06, 0.07);
  }
  function sfxCrash() {
    tone(160, 40, 0.5, "sawtooth", 0.14);
    tone(60, 30, 0.4, "square", 0.08, 0.02);
  }
  function sfxShield() {
    tone(300, 720, 0.16, "sine", 0.1);
  }

  function emitHud() {
    const hud: Hud = {
      score: Math.floor(score),
      coins,
      best,
      speed: Math.round(speed * 10) / 10,
      mult: combo,
      shield: shieldActive,
      magnet: magnetT > 0,
      x2: x2T > 0,
    };
    const key = [
      hud.score,
      hud.coins,
      hud.best,
      hud.speed,
      hud.mult,
      hud.shield,
      hud.magnet,
      hud.x2,
    ].join("|");
    if (key !== lastHud) {
      lastHud = key;
      callbacks.onHud(hud);
    }
  }

  function reset() {
    speed = START_SPEED;
    coins = 0;
    score = 0;
    spawnTimer = 1.0;
    powerTimer = 7;
    combo = 1;
    comboT = 0;
    magnetT = 0;
    x2T = 0;
    invulnT = 0;
    shieldActive = false;
    hitStopT = 0;
    shakeT = 0;
    shakeMag = 0;
    playerState.lane = 1;
    playerState.x = 0;
    playerState.vy = 0;
    playerState.y = 0;
    playerState.grounded = true;
    playerState.squash = 0;
    playerState.run = 0;
    playerState.blink = 0;
    playerState.dying = false;
    for (const ob of pool) recycle(ob);
    bubble.visible = false;
    player.position.set(0, 0.8, 0);
    player.rotation.set(0, 0, 0);
    player.scale.set(1, 1, 1);
    clock.update();
    clock.getDelta();
  }

  callbacks.onHud({
    score: 0,
    coins: 0,
    best,
    speed: START_SPEED,
    mult: 1,
    shield: false,
    magnet: false,
    x2: false,
  });

  function die() {
    if (playerState.dying) return;
    playerState.dying = true;
    speed = 0;
    combo = 1;
    sfxCrash();
    shakeMag = 0.5;
    shakeT = 0.6;
    burst(scorePos, COLORS.ink, 22, 6, 0.22, 0.9, 30, 7);
    burst(scorePos, COLORS.accent, 14, 5, 0.16, 0.8, 24, 6);
    burst(scorePos, COLORS.red, 12, 9, 0.2, 1.0, 34, 8);
    window.setTimeout(() => {
      if (mode === "playing" || mode === "paused") {
        mode = "over";
        callbacks.onUi("over");
      }
    }, 700);
  }

  function gameOverCleanup() {
    const scoreInt = Math.floor(score);
    if (scoreInt > best) {
      best = scoreInt;
      try {
        localStorage.setItem(BEST_KEY, String(best));
      } catch {
        /* ignore */
      }
    }
  }

  function hit(ob: ObData) {
    if (invulnT > 0) return;
    if (shieldActive && ob.kind !== "coin") {
      shieldActive = false;
      bubble.visible = false;
      invulnT = 1.0;
      hitStopT = 0.14;
      sfxShield();
      burst(
        new THREE.Vector3(playerState.x, 0.9, 0),
        COLORS.accent,
        18,
        6,
        0.18,
        0.7,
        26,
        6,
        true
      );
      toast("shield spent!");
      return;
    }
    gameOverCleanup();
    die();
  }

      let bossSpawned = false;
      const BOSS_AT = 20_250;

  function takeBoss() {
    bossSpawned = true;
    const ob = takeBar() ?? takeBox(1, 1.2, BOX_MATS[0]);
    if (!ob) return;
    ob.boss = true;
    ob.mesh.scale.set(7.5, 2.6, 5.5);
    (ob.mesh.material as THREE.MeshStandardMaterial).color.setHex(
      COLORS.red
    );
    (ob.mesh.material as THREE.MeshStandardMaterial).emissive.setHex(
      COLORS.bg
    );
    (ob.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.55;
    ob.mesh.position.set(0, ob.height / 2, -150);
    toast("a legend stands in your way…");
  }

  function defeatBoss() {
    bossSpawned = false;
    burst(
      player.position.clone().setY(1.2),
      COLORS.gold,
      160,
      9,
      0.3,
      1.15,
      30,
      10,
      true
    );
    burst(
      player.position.clone().setY(1.2),
      COLORS.red,
      80,
      6,
      0.2,
      0.9,
      22,
      8,
      true
    );
    toast("YOU DEFEATED ANANVAY PANDEY \u221E!");
    tone(120, 2600, 0.9, "square", 0.15);
    score += 2500 * (x2T > 0 ? 2 : 1);
    coins += 10;
    emitHud();
  }

  function spawn() {
    const r = Math.random();
    if (!bossSpawned && speed >= MAX_SPEED && score >= BOSS_AT) {
      takeBoss();
      return;
    }
    if (r < 0.13) {
      const lane = Math.floor(Math.random() * 3);
      for (let i = 0; i < 3; i++) {
        const coin = takeCoin(lane, 2.0);
        if (coin) coin.mesh.position.z = -90 + i * 6;
      }
    } else if (r < 0.31) {
      const bar = takeBar();
      if (bar) (bar.mesh.material as THREE.MeshStandardMaterial).color.setHex(
        Math.random() < 0.5 ? COLORS.red : COLORS.accent2
      );
    } else if (r < 0.61) {
      const lane = Math.floor(Math.random() * 3);
      const tall = Math.random() < 0.42;
      const mat = BOX_MATS[Math.floor(Math.random() * BOX_MATS.length)];
      takeBox(lane, tall ? 2.75 : 1.4, mat);
    } else if (r < 0.85) {
      const lanes = Math.random() < 0.5 ? [0, 1] : [1, 2];
      const tall = Math.random() < 0.42;
      takeBox(lanes[0], tall ? 2.75 : 1.4, BOX_MATS[0]);
      takeBox(lanes[1], tall ? 2.75 : 1.4, BOX_MATS[1]);
    } else {
      const lanes = Math.random() < 0.5 ? [0, 2] : [0, 1];
      takeBox(lanes[0], 1.6, Math.random() < 0.5 ? BOX_MATS[0] : BOX_MATS[2]);
      takeBox(lanes[1], 1.6, Math.random() < 0.5 ? BOX_MATS[1] : BOX_MATS[0]);
    }
  }

  function spawnPower() {
    const variant: NonNullable<ObData["variant"]>[] = [
      "shield",
      "magnet",
      "x2",
    ];
    const v = variant[Math.floor(Math.random() * variant.length)];
    const lane = Math.floor(Math.random() * 3);
    takePower(lane, v);
    toast(v === "shield" ? "shield!"
      : v === "magnet" ? "magnet!"
      : "double points!");
    sfxPower();
  }

  function addCombo() {
    combo = Math.min(5, combo + 1);
    comboT = 3.2;
  }

  const jumpNow = () => {
    if (playerState.dying || mode !== "playing") return;
    if (playerState.grounded) {
      playerState.vy = JUMP_V;
      playerState.grounded = false;
      sfxJump();
    }
  };

  const moveLane = (dir: -1 | 1) => {
    if (mode !== "playing" || playerState.dying) return;
    playerState.lane = Math.max(
      0,
      Math.min(2, playerState.lane + (dir as number))
    );
  };

  function start() {
    reset();
    mode = "playing";
    tone(420, 840, 0.16, "triangle", 0.07);
    callbacks.onUi("playing");
  }

  function pause() {
    if (mode !== "playing" || playerState.dying) return;
    mode = "paused";
    callbacks.onUi("paused");
  }

  function resume() {
    if (mode !== "paused") return;
    clock.update();
    clock.getDelta();
    mode = "playing";
    callbacks.onUi("playing");
  }

  function togglePause() {
    if (mode === "playing" && !playerState.dying) pause();
    else if (mode === "paused") resume();
  }

  callbacks.setHandles({
    start,
    togglePause,
    resume,
    restart: start,
    jump: jumpNow,
    lane: moveLane,
  });

  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (
      t &&
      (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
    ) {
      return;
    }
    const c = e.code;
    if (c === "ArrowLeft" || c === "KeyA") {
      e.preventDefault();
      moveLane(-1);
    } else if (c === "ArrowRight" || c === "KeyD") {
      e.preventDefault();
      moveLane(1);
    } else if (c === "Space" || c === "ArrowUp" || c === "KeyW") {
      e.preventDefault();
      if (mode === "playing") jumpNow();
      else if (mode === "ready") start();
      else if (mode === "paused") resume();
      else if (mode === "over") start();
    } else if (c === "Enter") {
      e.preventDefault();
      if (mode === "ready" || mode === "over") start();
      else if (mode === "paused") resume();
    } else if (c === "KeyP" || c === "Escape") {
      togglePause();
    } else if (c === "KeyM") {
      muted = !muted;
      toast(muted ? "sound off" : "sound on");
    }
  };
  window.addEventListener("keydown", onKey);

  function onResize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(onResize);
  ro.observe(host);
  window.addEventListener("resize", onResize);

  let tier = 0;
  const tierAt = [20, 26, 32];

  function tick() {
    raf = requestAnimationFrame(tick);
    clock.update();
    let raw = Math.min(clock.getDelta(), 0.05);
    if (hitStopT > 0) {
      hitStopT -= raw;
      raw = 0;
    }
    const dt = raw;
    const t = performance.now() / 1000;

    if (mode === "playing" && !playerState.dying) {
      speed = Math.min(MAX_SPEED, speed + dt * 0.34);
      const mult = combo * (x2T > 0 ? 2 : 1);
      score += speed * dt * 2 * mult;

      while (tier < tierAt.length && speed >= tierAt[tier]) {
        tier++;
        toast(`speed ${tier + 1}!`);
        tone(500, 1000, 0.22, "triangle", 0.08);
      }

      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawn();
        const m = 0.9 + Math.random() * 0.2;
        spawnTimer = Math.max(
          0.38,
          Math.min(0.95, (0.82 * (START_SPEED / speed)) * m)
        );
      }
      powerTimer -= dt;
      if (powerTimer <= 0) {
        spawnPower();
        powerTimer = 7 + Math.random() * 5;
      }

      if (playerState.grounded) {
        playerState.vy = 0;
        playerState.y = 0;
      } else {
        playerState.vy -= GRAVITY * dt;
        playerState.y += playerState.vy * dt;
        if (playerState.y <= 0) {
          playerState.y = 0;
          playerState.grounded = true;
          playerState.squash = 0.34;
          sfxLand();
          burst(
            new THREE.Vector3(playerState.x, 0.05, 0),
            0xc9b489,
            7,
            3,
            0.14,
            0.5,
            16,
            1.5
          );
        }
      }

      const targetX = LANE_X[playerState.lane];
      playerState.x += (targetX - playerState.x) * Math.min(1, dt * 11);
      const vel = playerState.x - player.position.x;
      player.position.x = playerState.x;
      const baseY = playerState.y + 0.8;
      const bob =
        playerState.grounded && speed > 0
          ? Math.abs(Math.sin(playerState.run * 0.5)) * 0.08 * Math.min(1, speed / 20)
          : 0;
      player.position.y = baseY - bob;
      player.rotation.z = THREE.MathUtils.clamp(vel * 0.22, -0.3, 0.3);
      player.rotation.x = -Math.abs(vel) * 0.08;
      playerState.run += dt * (speed / START_SPEED) * 10;

      const squashT = Math.max(0, playerState.squash - dt * 2.2);
      playerState.squash = squashT;
      const sq = Math.sin(Math.min(squashT * 2.6, Math.PI));
      player.scale.y = 1 + sq * 0.2;
      player.scale.x = 1 - sq * 0.13;
      player.scale.z = 1 - sq * 0.13;

      for (const f of feet) {
        const s = Math.max(0, Math.sin(playerState.run + f.phase));
        f.mesh.position.y = -1.02 + Math.min(0.45, s * 0.34);
        f.mesh.rotation.x = Math.sin(playerState.run + f.phase) * 0.3;
      }

      if (playerState.blink > 0) {
        playerState.blink -= dt;
        for (const p of eyes) p.eye.scale.set(1, 0.15, 1);
      } else {
        for (const p of eyes) p.eye.scale.set(1, 1, 1);
        if (Math.random() < dt * 0.5) playerState.blink = 0.12;
      }

      dustTimer -= dt;
      if (dustTimer <= 0 && playerState.grounded) {
        dustTimer = 0.09;
        burst(
          new THREE.Vector3(
            playerState.x - 0.4,
            0.05,
            Math.random() * 0.4 - 0.2
          ),
          0xc9b489,
          1,
          2.2,
          0.13,
          0.45,
          9,
          2
        );
      }

      const feetY = playerState.y;
      const centerY = playerState.y + 0.8;
      const multNow = combo * (x2T > 0 ? 2 : 1);

      for (const ob of pool) {
        if (!ob.active) continue;
        if (ob.kind === "coin") {
          const cx = LANE_X[ob.lane];
          const cz = ob.mesh.position.z;
          if (magnetT > 0) {
            const dxC = playerState.x - cx;
            const dzC = 0 - cz;
            const d = Math.hypot(dxC, dzC);
            if (d < 7 && d > 0.01) {
              ob.mesh.position.x +=
                (dxC / d) * Math.min(14, d) * dt * 3;
              ob.mesh.position.z +=
                (dzC / d) * Math.min(14, d) * dt * 3;
            }
          } else {
            ob.mesh.position.z += speed * dt;
          }
          ob.mesh.rotation.z += dt * 3.8;
          ob.mesh.position.y = 2.0 + Math.sin(t * 3 + cz) * 0.14;
          const dz = Math.abs(ob.mesh.position.z);
          const dx = Math.abs(playerState.x - ob.mesh.position.x);
          if (
            dz < 1.15 &&
            dx < 1.15 &&
            Math.abs(centerY - ob.mesh.position.y) < 1.25 &&
            !playerState.dying
          ) {
            coins += 1;
            score += 25 * multNow;
            addCombo();
            sfxCoin();
            burst(ob.mesh.position.clone(), COLORS.gold, 8, 4, 0.13, 0.5, 16, 5, true);
            if (combo === 3 || combo === 5) {
              toast(`combo x${combo}!`);
              tone(660, 1320, 0.22, "triangle", 0.08);
            }
            recycle(ob);
          } else if (ob.mesh.position.z > 7) {
            recycle(ob);
          }
          continue;
        }
        if (ob.kind === "power") {
          ob.mesh.position.z += speed * dt;
          ob.mesh.rotation.y += dt * 2.4;
          ob.mesh.position.y =
            (ob.variant === "x2" ? 1.0 : ob.variant === "magnet" ? 1.0 : 0.95) +
            Math.sin(t * 2.6) * 0.16;
          const dz = Math.abs(ob.mesh.position.z);
          const dx = Math.abs(playerState.x - LANE_X[ob.lane]);
          if (dz < 1.2 && dx < 1.15) {
            if (ob.variant === "shield") {
              shieldActive = true;
              bubble.visible = true;
              toast("shield on!");
            } else if (ob.variant === "magnet") {
              magnetT = 6;
              toast("magnet on!");
            } else {
              x2T = 6;
              toast("doubled!");
            }
            tone(700, 1400, 0.16, "triangle", 0.09);
            burst(ob.mesh.position.clone(), COLORS.gold, 16, 5, 0.15, 0.6, 18, 6, true);
            recycle(ob);
          } else if (ob.mesh.position.z > 7) {
            recycle(ob);
          }
          continue;
        }

        ob.mesh.position.z += speed * dt;
        const obPz = ob.mesh.position.z;
        const dx =
          ob.kind === "bar"
            ? 0.4
            : Math.abs(playerState.x - LANE_X[ob.lane]);
        const dz = Math.abs(obPz);
        if (dz < ob.depth / 2 + PLAYER_HALF && dx < 1.05 && feetY < ob.height) {
          hit(ob);
          if (playerState.dying) break;
        }
        if (!ob.gaveBonus && obPz > 1.2) {
          ob.gaveBonus = true;
          if (ob.kind === "bar") {
            if (feetY >= ob.height) {
              if (ob.boss) {
                defeatBoss();
              } else {
                score += 15 * multNow;
                toast("clean jump +15");
              }
            }
          } else if (dx < 1.9) {
            score += 15 * multNow;
            toast(dx < 0.9 ? "cheeky +15" : "close call +15");
          }
        }
        if (obPz > 7) recycle(ob);
      }

      if (comboT > 0) {
        comboT -= dt;
        if (comboT <= 0 && combo > 1) {
          combo = 1;
          toast("combo lost");
        }
      }
    } else if (mode === "playing" && playerState.dying) {
      playerState.y = Math.max(playerState.y - dt * 5, -2.2);
      player.rotation.z += dt * 7;
      player.rotation.x += dt * 2;
      player.position.y = playerState.y + 0.8;
    } else if (mode === "ready") {
      player.position.y = 0.8 + Math.sin(t * 2.2) * 0.12;
      player.rotation.z = Math.sin(t * 1.4) * 0.05;
    } else if (mode === "paused" || mode === "over") {
      player.position.x += (0 - player.position.x) * Math.min(1, dt * 4);
    }

    if (magnetT > 0) magnetT -= dt;
    if (x2T > 0) x2T -= dt;
    if (invulnT > 0) invulnT -= dt;
    bubble.position.set(player.position.x, player.position.y, 0);
    bubble.rotation.y += dt * 1.5;

    for (const p of particlePool) {
      if (!p.active) continue;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.vel.y -= p.grav * dt;
      p.vel.multiplyScalar(p.drag);
      p.life -= dt;
      const k = Math.max(0, p.life / p.maxLife);
      p.mat.opacity = k;
      p.mesh.scale.multiplyScalar(1 - (1 - k) * 0);
      if (p.life <= 0) {
        p.active = false;
        p.mesh.visible = false;
      }
    }

    const parallax = mode === "playing" ? speed : mode === "ready" ? 6 : 0;
    for (const d of drifters) {
      d.group.position.z += parallax * d.speed * dt;
      if (d.group.position.z > 8) {
        d.group.position.z -= 240;
        d.group.position.x =
          (d.group.position.x < 0 ? -1 : 1) *
          (Math.random() < 0.5 ? 8.5 + Math.random() * 5 : 13 + Math.random() * 10);
      }
    }

    shakeT = Math.max(0, shakeT - dt);
    const sh = shakeT > 0 ? shakeMag * shakeT * 6 : 0;
    camera.position.x = Math.sin(t * 51) * sh * 0.3;
    camera.position.y = 5.6 + Math.sin(t * 61) * sh * 0.18;
    camera.lookAt(0, 1.4, -12);

    fovTimer += dt;
    if (fovTimer > 0.2) {
      fovTimer = 0;
      const targetFov =
        62 + ((speed - START_SPEED) / (MAX_SPEED - START_SPEED)) * 10;
      camera.fov += (targetFov - camera.fov) * 0.4;
      camera.updateProjectionMatrix();
    }

    shadowBlob.position.set(player.position.x, 0.01, player.position.z);
    glow.position.x = player.position.x;
    glow.position.z = player.position.z - 2;
    scorePos.copy(player.position);
    shadowBlob.scale.setScalar(
      1.2 * Math.max(0.32, 1 - playerState.y / 4.2)
    );
    (shadowBlob.material as THREE.MeshBasicMaterial).opacity =
      0.2 * (1 - playerState.y / 7);

    emitHud();
    renderer.render(scene, camera);
  }

  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
    ro.disconnect();
    window.clearTimeout(toastTimer);
    clock.dispose();
    groundTex.dispose();
    skyTex.dispose();
    mountTex.dispose();
    sunTex.dispose();
    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      disposables.push(obj.geometry);
      const m = obj.material;
      if (Array.isArray(m)) m.forEach((x) => disposables.push(x));
      else disposables.push(m);
    });
    for (const d of disposables) d.dispose();
    scene.clear();
    renderer.dispose();
    if (elToast.parentElement === host) host.removeChild(elToast);
    if (renderer.domElement.parentElement === host) {
      host.removeChild(renderer.domElement);
    }
  };
}

function BoardList({
  list,
  current,
}: {
  list: LeaderboardEntry[];
  current?: string;
}) {
  return (
    <ol className="space-y-1 text-left font-sans text-sm">
      <li
        aria-label="pinned legend"
        title="unbeatable — you are the ∞"
        className="flex items-baseline justify-between gap-2 rounded-md bg-gradient-to-r from-gold/25 via-gold/10 to-transparent px-2 py-1 ring-1 ring-gold/40"
      >
        <span className="min-w-0 truncate">
          <span className="mr-1.5 inline-block w-5 shrink-0 text-right font-hand text-base text-gold">
            ∞
          </span>
          <span className="font-medium text-gold">ANANVAY PANDEY</span>
        </span>
        <span className="shrink-0 font-hand text-base text-gold">∞</span>
      </li>
      {!list.length ? (
        <li className="pt-1">
          <p className="font-hand text-lg text-faint">
            no one else has accepted the legend… yet
          </p>
        </li>
      ) : (
        list.map((e, i) => {
          const me = e.name === current;
          return (
            <li
              key={`${i}-${e.name}`}
              className={`flex items-baseline justify-between gap-2 rounded-md px-2 py-1 ${
                me ? "bg-accent/10 font-medium text-accent-2" : ""
              }`}
            >
              <span className="min-w-0 truncate">
                <span className="mr-1.5 inline-block w-5 shrink-0 text-right font-hand text-base text-faint">
                  {i + 2}
                </span>
                <span className="truncate">{e.name}</span>
              </span>
              <span className="shrink-0 font-hand text-base text-foreground">
                {e.score}
              </span>
            </li>
          );
        })
      )}
    </ol>
  );
}

function BoardPanel({
  state,
  list,
  current,
}: {
  state: "loading" | "ready" | "error";
  list: LeaderboardEntry[];
  current?: string;
}) {
  return (
    <div className="border-t-2 border-dashed border-borderish pt-3">
      <p className="mb-2 font-hand text-lg text-foreground">
        leaderboard{" "}
        <span className="text-faint">
          Â· {leaderboardEnabled ? "every visitor" : "this device"}
        </span>
      </p>
      {state === "loading" && (
        <p className="font-hand text-lg text-faint">loadingâ€¦</p>
      )}
      {state === "error" && (
        <p className="font-hand text-lg text-muted">
          can&apos;t reach the board right now
        </p>
      )}
      {state === "ready" && <BoardList list={list} current={current} />}
    </div>
  );
}

export default function Game() {
  const hostRef = useRef<HTMLDivElement>(null);
  const handlesRef = useRef<GameHandles | null>(null);
  const [ui, setUi] = useState<UiState>(() =>
    typeof window !== "undefined" && !detectWebGL()
      ? "unsupported"
      : "ready"
  );
  const [hud, setHud] = useState<Hud>({
    score: 0,
    coins: 0,
    best: 0,
    speed: START_SPEED,
    mult: 1,
    shield: false,
    magnet: false,
    x2: false,
  });
  const skipWeb = ui === "unsupported";

  const [name, setName] = useState<string>(() =>
    typeof window !== "undefined" ? getSavedName() : ""
  );
  const nameRef = useRef(name);
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [boardState, setBoardState] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "failed"
  >("idle");
  const lastSubmittedRef = useRef(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (skipWeb) return;
    let disposed = false;
    let destroy: (() => void) | null = null;
    try {
      destroy = buildGame(host, {
        onUi: (s) => {
          if (!disposed) setUi(s);
        },
        onHud: (h) => {
          if (!disposed) setHud(h);
        },
        setHandles: (h) => {
          handlesRef.current = h;
        },
      });
    } catch {
      console.warn("Paper Runner failed to start:", new Error().stack);
    }
    return () => {
      disposed = true;
      handlesRef.current = null;
      destroy?.();
    };
  }, [skipWeb]);

  useEffect(() => {
    nameRef.current = name;
    storeName(name);
  }, [name]);

useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const list = await fetchLeaderboard(8);
        if (!active) return;
        setBoard(list);
        setBoardState("ready");
      } catch {
        if (!active) return;
        setBoardState("error");
      }
    };
    refresh();
    const poll = window.setInterval(refresh, 5000);
    return () => {
      active = false;
      window.clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    if (ui !== "over") return;
    const score = hud.score;
    if (score <= 0 || lastSubmittedRef.current === score) return;
    lastSubmittedRef.current = score;
    let active = true;
    (async () => {
      setSaveState("saving");
      try {
        await submitScore(nameRef.current, score, hud.coins);
        if (!active) return;
        setSaveState("saved");
        const list = await fetchLeaderboard(8);
        if (!active) return;
        setBoard(list);
        setBoardState("ready");
      } catch {
        if (!active) return;
        setSaveState("failed");
      }
    })();
    return () => {
      active = false;
    };
  }, [ui, hud.score, hud.coins]);

  const btn =
    "rounded-full border-2 border-foreground bg-foreground px-6 py-2 font-hand text-xl font-medium text-background transition-transform hover:-translate-y-0.5 hover:rotate-1 hover:bg-accent hover:border-accent";

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <div className="mb-6 flex flex-col items-center gap-1 text-center">
        <h1 className="font-hand text-4xl font-semibold tracking-tight sm:text-5xl">
          Paper <span className="text-gradient">Runner</span>
        </h1>
        <p className="font-hand text-xl text-muted">
          a doodle-speed endless runner Â· chain combos, grab power-ups, own the
          ink
        </p>
      </div>

      <div
        ref={hostRef}
        className="relative h-[460px] w-full touch-none select-none overflow-hidden rounded-2xl border-2 border-borderish bg-background shadow-[0_20px_50px_-20px_rgba(60,50,30,0.45)] sm:h-[560px]"
        style={{ touchAction: "none" }}
        onPointerDown={(e) => {
          const h = handlesRef.current;
          if (!h) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (ui === "playing") {
            if (x < rect.width * 0.12) h.lane(-1);
            else if (x > rect.width * 0.88) h.lane(1);
            else h.jump();
          } else if (ui === "ready" || ui === "over") {
            h.start();
          } else if (ui === "paused") {
            h.resume();
          }
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(33,31,26,0.16) 100%)",
          }}
        />

        {ui === "unsupported" && (
          <div className="absolute inset-0 z-10 grid place-items-center p-6 text-center">
            <p className="font-hand text-2xl text-muted">
              Let&apos;s keep it 2D â€” your browser can&apos;t do WebGL.
            </p>
          </div>
        )}

        {ui !== "unsupported" && ui === "ready" && (
          <div className="absolute inset-0 z-10 grid place-items-center overflow-y-auto bg-background/50 p-4 backdrop-blur-[2px]">
            <div className="max-h-full w-full max-w-sm overflow-y-auto rounded-2xl border-2 border-borderish bg-surface p-6 text-center shadow-[0_16px_40px_-16px_rgba(60,50,30,0.5)]">
              <p className="font-hand text-2xl leading-snug text-foreground">
                Dodge the ink, jump the bars,
                <br />
                <span className="text-accent">chain coins for combos.</span>
              </p>
              <div className="mx-auto mt-3 max-w-[260px] space-y-1 text-left font-sans text-sm text-muted">
                <p>â† â†’ / A D â€” switch lane</p>
                <p>â†‘ / W / Space â€” jump Â· tap to jump</p>
                <p>P / Esc â€” pause Â· M â€” sound</p>
              </div>
              <div className="mx-auto mt-3 flex max-w-[260px] flex-wrap items-center justify-center gap-x-3 gap-y-1 font-sans text-xs text-muted">
                <span className="text-accent">ring=shield</span>
                <span className="text-[#b97f1d]">ball=magnet Â· pillar=x2</span>
              </div>
              <label className="mt-4 block text-left font-sans text-xs text-muted">
                your name
                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value.replace(/[\u0000-\u001f\u007f]/g, ""))
                  }
                  onPointerDown={(e) => e.stopPropagation()}
                  maxLength={18}
                  placeholder="anonymous"
                  className="mt-1 w-full rounded-lg border-2 border-borderish bg-background/60 px-3 py-1.5 font-hand text-lg text-foreground outline-none transition-colors focus:border-accent/50"
                />
              </label>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handlesRef.current?.start()}
                className={`${btn} mt-4`}
              >
                Start running
              </button>
              <p className="mt-3 font-hand text-lg text-faint">
                best so far: {hud.best}
              </p>
              <div className="mt-4">
                <BoardPanel state={boardState} list={board} current={sanitizeName(name)} />
                {!leaderboardEnabled && (
                  <p className="mt-2 font-sans text-[11px] text-faint">
                    add Supabase keys (.env.local) to compete with every
                    visitor
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {ui !== "unsupported" && ui === "paused" && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-background/60 backdrop-blur-[2px]">
            <div className="rounded-2xl border-2 border-borderish bg-surface p-6 text-center shadow-[0_16px_40px_-16px_rgba(60,50,30,0.5)]">
              <p className="font-hand text-4xl text-foreground">paused</p>
              <div className="mt-4 flex gap-3">
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => handlesRef.current?.resume()}
                  className={btn}
                >
                  Keep going
                </button>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => handlesRef.current?.start()}
                  className="rounded-full border-2 border-borderish bg-surface px-6 py-2 font-hand text-xl text-muted transition-transform hover:-translate-y-0.5"
                >
                  Restart
                </button>
              </div>
            </div>
          </div>
        )}

        {ui !== "unsupported" && ui === "over" && (
          <div className="absolute inset-0 z-10 grid place-items-center overflow-y-auto bg-background/60 p-4 backdrop-blur-[2px]">
            <div className="max-h-full w-full max-w-sm overflow-y-auto rounded-2xl border-2 border-borderish bg-surface p-6 text-center shadow-[0_16px_40px_-16px_rgba(60,50,30,0.5)]">
              <p className="font-hand text-5xl text-ink-red">smacked!</p>
              <div className="mt-2 flex items-baseline justify-center gap-5">
                <p className="font-hand text-2xl text-foreground">
                  score{" "}
                  <span className="text-accent">{hud.score}</span>
                </p>
                <p className="font-hand text-xl text-muted">
                  best <span className="text-foreground">{hud.best}</span>
                </p>
              </div>
              <p className="font-sans text-sm text-muted">
                coins collected: {hud.coins}
              </p>
              <label className="mt-4 block text-left font-sans text-xs text-muted">
                your name
                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value.replace(/[\u0000-\u001f\u007f]/g, ""))
                  }
                  onPointerDown={(e) => e.stopPropagation()}
                  maxLength={18}
                  placeholder="anonymous"
                  className="mt-1 w-full rounded-lg border-2 border-borderish bg-background/60 px-3 py-1.5 font-hand text-lg text-foreground outline-none transition-colors focus:border-accent/50"
                />
              </label>
              <div className="mb-2 mt-2 min-h-[1.5rem] font-hand text-lg">
                {saveState === "saving" && (
                  <span className="text-muted">saving your runâ€¦</span>
                )}
                {saveState === "saved" && (
                  <span className="text-accent">score saved â€” world called, it&apos;s jealous</span>
                )}
                {saveState === "failed" && (
                  <span className="text-ink-red">couldn&apos;t save â€” check your internet</span>
                )}
              </div>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handlesRef.current?.start()}
                className={`${btn} mt-1`}
              >
                Run it back
              </button>
              <div className="mt-4">
                <BoardPanel state={boardState} list={board} current={sanitizeName(name)} />
              </div>
            </div>
          </div>
        )}

        {ui !== "unsupported" && (ui === "playing" || ui === "paused") && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg border border-borderish bg-surface/80 px-3 py-1.5 backdrop-blur-sm">
                <span className="font-hand text-2xl text-foreground">
                  {hud.score}
                </span>
                <span className="ml-2 font-hand text-lg text-faint">
                  {hud.coins}Â¢ Â· {hud.speed.toFixed(1)}x
                </span>
              </div>
              {hud.mult > 1 && (
                <span className="rounded-lg border-2 border-accent/40 bg-accent/10 px-2 py-1 font-hand text-lg text-accent-2">
                  x{hud.mult}
                </span>
              )}
              <div className="flex flex-col gap-1">
                {hud.shield && (
                  <span className="rounded-md border border-accent/40 bg-surface/80 px-2 py-0.5 font-sans text-[11px] text-accent-2 backdrop-blur-sm">
                    shield
                  </span>
                )}
                {hud.magnet && (
                  <span className="rounded-md border border-[#b97f1d]/50 bg-surface/80 px-2 py-0.5 font-sans text-[11px] text-[#8a5f14] backdrop-blur-sm">
                    magnet
                  </span>
                )}
                {hud.x2 && (
                  <span className="rounded-md border border-[#b97f1d]/50 bg-surface/80 px-2 py-0.5 font-sans text-[11px] text-[#8a5f14] backdrop-blur-sm">
                    x2
                  </span>
                )}
              </div>
            </div>
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                handlesRef.current?.togglePause();
              }}
              className="pointer-events-auto rounded-lg border border-borderish bg-surface/80 px-3 py-1.5 font-hand text-lg text-muted backdrop-blur-sm transition-colors hover:text-foreground"
            >
              {ui === "paused" ? "play" : "pause"}
            </button>
          </div>
        )}

        {ui !== "unsupported" && ui === "playing" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4 sm:hidden">
            <div className="pointer-events-auto flex gap-4">
              <button
                aria-label="Move left"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlesRef.current?.lane(-1);
                }}
                className="grid h-16 w-16 place-items-center rounded-full border-2 border-foreground/30 bg-surface/70 font-hand text-3xl text-foreground backdrop-blur-sm active:scale-95"
              >
                â†
              </button>
              <button
                aria-label="Move right"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlesRef.current?.lane(1);
                }}
                className="grid h-16 w-16 place-items-center rounded-full border-2 border-foreground/30 bg-surface/70 font-hand text-3xl text-foreground backdrop-blur-sm active:scale-95"
              >
                â†’
              </button>
            </div>
            <button
              aria-label="Jump"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlesRef.current?.jump();
              }}
              className="pointer-events-auto grid h-20 w-20 place-items-center rounded-full border-2 border-foreground bg-accent font-hand text-3xl text-background shadow-[0_10px_24px_-10px_rgba(49,81,194,0.6)] active:scale-95"
            >
              â†‘
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center font-hand text-lg text-muted">
        arrow keys / WASD to move Â· space to jump Â· chain coins for combo
        multipliers Â· on mobile swipe & tap
      </p>
    </section>
  );
}
