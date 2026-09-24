"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchLeaderboard,
  submitScore,
  getSavedName,
  storeName,
  leaderboardEnabled,
  type LeaderboardEntry,
} from "@/lib/leaderboard";

type UiState = "ready" | "playing" | "paused" | "over" | "win";

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

interface GameHandles {
  start: () => void;
  togglePause: () => void;
  resume: () => void;
  restart: () => void;
  jump: () => void;
  lane: (dir: -1 | 0 | 1) => void;
}

const TILE = 40;
const ROWS = 14;
const GROUND_TOP = 12;
const VIEW_H = ROWS * TILE;
const P_W = 24;
const P_H = 36;
const COLORS = {
  paper: "#fbf7ec",
  ink: "#3a3f4b",
  inkSoft: "rgba(58,63,75,0.55)",
  accent: "#3151c2",
  accent2: "#203aa0",
  red: "#cf4a33",
  faint: "#b9b39f",
  gold: "#e8a53a",
  goldDark: "#b07a1b",
  ruled: "rgba(120,148,205,0.16)",
  margin: "rgba(207,74,51,0.35)",
};

const LEVELS: {
  w: number;
  gaps?: [number, number][];
  platforms: { x: number; y: number; w: number }[];
  coins: { x: number; y: number }[];
  enemies: { x: number; span: number }[];
  boss?: boolean;
}[] = [
  {
    w: 90,
    platforms: [
      { x: 14, y: 10, w: 4 },
      { x: 22, y: 8, w: 4 },
      { x: 40, y: 9, w: 3 },
      { x: 52, y: 7, w: 4 },
      { x: 66, y: 9, w: 3 },
    ],
    coins: [
      { x: 11, y: 11 },
      { x: 12, y: 11 },
      { x: 15, y: 9 },
      { x: 16, y: 9 },
      { x: 17, y: 9 },
      { x: 23, y: 7 },
      { x: 24, y: 7 },
      { x: 25, y: 7 },
      { x: 41, y: 8 },
      { x: 42, y: 8 },
      { x: 53, y: 6 },
      { x: 54, y: 6 },
      { x: 55, y: 6 },
      { x: 31, y: 11 },
      { x: 32, y: 11 },
      { x: 33, y: 11 },
      { x: 72, y: 11 },
      { x: 73, y: 11 },
      { x: 74, y: 11 },
    ],
    enemies: [
      { x: 30, span: 3 },
      { x: 60, span: 3 },
    ],
  },
  {
    w: 130,
    gaps: [
      [55, 58],
      [96, 99],
    ],
    platforms: [
      { x: 10, y: 8, w: 4 },
      { x: 24, y: 6, w: 5 },
      { x: 44, y: 9, w: 4 },
      { x: 58, y: 6, w: 3 },
      { x: 72, y: 8, w: 5 },
      { x: 98, y: 6, w: 4 },
      { x: 112, y: 9, w: 4 },
    ],
    coins: [
      { x: 12, y: 7 },
      { x: 13, y: 7 },
      { x: 25, y: 5 },
      { x: 26, y: 5 },
      { x: 27, y: 5 },
      { x: 28, y: 5 },
      { x: 59, y: 5 },
      { x: 60, y: 5 },
      { x: 61, y: 5 },
      { x: 99, y: 5 },
      { x: 100, y: 5 },
      { x: 101, y: 5 },
      { x: 50, y: 11 },
      { x: 51, y: 11 },
      { x: 52, y: 11 },
      { x: 78, y: 11 },
      { x: 79, y: 11 },
      { x: 80, y: 11 },
      { x: 118, y: 11 },
      { x: 119, y: 11 },
    ],
    enemies: [
      { x: 18, span: 2 },
      { x: 34, span: 3 },
      { x: 68, span: 2 },
      { x: 108, span: 3 },
    ],
  },
  {
    w: 150,
    gaps: [
      [70, 74],
      [110, 114],
    ],
    platforms: [
      { x: 12, y: 9, w: 3 },
      { x: 20, y: 7, w: 4 },
      { x: 30, y: 5, w: 3 },
      { x: 44, y: 8, w: 4 },
      { x: 60, y: 6, w: 3 },
      { x: 76, y: 9, w: 3 },
      { x: 90, y: 6, w: 5 },
      { x: 104, y: 8, w: 4 },
      { x: 120, y: 7, w: 3 },
      { x: 134, y: 8, w: 4 },
    ],
    coins: [
      { x: 21, y: 6 },
      { x: 22, y: 6 },
      { x: 23, y: 6 },
      { x: 31, y: 4 },
      { x: 32, y: 4 },
      { x: 61, y: 5 },
      { x: 62, y: 5 },
      { x: 63, y: 5 },
      { x: 91, y: 5 },
      { x: 92, y: 5 },
      { x: 93, y: 5 },
      { x: 94, y: 5 },
      { x: 48, y: 11 },
      { x: 49, y: 11 },
      { x: 82, y: 11 },
      { x: 83, y: 11 },
      { x: 84, y: 11 },
      { x: 126, y: 11 },
      { x: 127, y: 11 },
      { x: 128, y: 11 },
      { x: 140, y: 11 },
      { x: 141, y: 11 },
    ],
    enemies: [
      { x: 16, span: 2 },
      { x: 38, span: 3 },
      { x: 56, span: 2 },
      { x: 86, span: 2 },
      { x: 98, span: 3 },
      { x: 130, span: 2 },
    ],
  },
  {
    w: 170,
    gaps: [
      [60, 64],
      [120, 125],
    ],
    platforms: [
      { x: 8, y: 8, w: 3 },
      { x: 16, y: 6, w: 4 },
      { x: 28, y: 4, w: 3 },
      { x: 40, y: 7, w: 4 },
      { x: 52, y: 5, w: 3 },
      { x: 68, y: 8, w: 4 },
      { x: 82, y: 6, w: 5 },
      { x: 96, y: 8, w: 4 },
      { x: 108, y: 5, w: 3 },
      { x: 130, y: 7, w: 4 },
      { x: 144, y: 8, w: 4 },
      { x: 156, y: 6, w: 4 },
    ],
    coins: [
      { x: 17, y: 5 },
      { x: 18, y: 5 },
      { x: 19, y: 5 },
      { x: 29, y: 3 },
      { x: 30, y: 3 },
      { x: 53, y: 4 },
      { x: 54, y: 4 },
      { x: 69, y: 7 },
      { x: 70, y: 7 },
      { x: 83, y: 5 },
      { x: 84, y: 5 },
      { x: 85, y: 5 },
      { x: 109, y: 4 },
      { x: 110, y: 4 },
      { x: 131, y: 6 },
      { x: 132, y: 6 },
      { x: 133, y: 6 },
      { x: 157, y: 5 },
      { x: 158, y: 5 },
      { x: 46, y: 11 },
      { x: 47, y: 11 },
      { x: 88, y: 11 },
      { x: 89, y: 11 },
      { x: 90, y: 11 },
      { x: 101, y: 11 },
      { x: 102, y: 11 },
      { x: 138, y: 11 },
      { x: 139, y: 11 },
    ],
    enemies: [
      { x: 11, span: 2 },
      { x: 34, span: 2 },
      { x: 46, span: 3 },
      { x: 74, span: 2 },
      { x: 92, span: 2 },
      { x: 100, span: 3 },
      { x: 124, span: 2 },
      { x: 152, span: 2 },
    ],
  },
  {
    w: 180,
    gaps: [
      [70, 74],
      [120, 124],
    ],
    platforms: [
      { x: 10, y: 9, w: 3 },
      { x: 22, y: 7, w: 4 },
      { x: 36, y: 5, w: 3 },
      { x: 50, y: 8, w: 4 },
      { x: 64, y: 6, w: 3 },
      { x: 78, y: 9, w: 4 },
      { x: 92, y: 7, w: 5 },
      { x: 106, y: 8, w: 4 },
      { x: 118, y: 6, w: 3 },
      { x: 132, y: 8, w: 4 },
      { x: 146, y: 7, w: 4 },
    ],
    coins: [
      { x: 23, y: 6 },
      { x: 24, y: 6 },
      { x: 25, y: 6 },
      { x: 37, y: 4 },
      { x: 38, y: 4 },
      { x: 65, y: 5 },
      { x: 66, y: 5 },
      { x: 67, y: 5 },
      { x: 93, y: 6 },
      { x: 94, y: 6 },
      { x: 95, y: 6 },
      { x: 96, y: 6 },
      { x: 119, y: 5 },
      { x: 133, y: 7 },
      { x: 134, y: 7 },
      { x: 147, y: 6 },
      { x: 148, y: 6 },
      { x: 149, y: 6 },
      { x: 30, y: 11 },
      { x: 31, y: 11 },
      { x: 54, y: 11 },
      { x: 55, y: 11 },
      { x: 84, y: 11 },
      { x: 85, y: 11 },
      { x: 86, y: 11 },
      { x: 112, y: 11 },
      { x: 113, y: 11 },
      { x: 140, y: 11 },
      { x: 141, y: 11 },
      { x: 160, y: 11 },
      { x: 161, y: 11 },
    ],
    enemies: [
      { x: 14, span: 2 },
      { x: 56, span: 3 },
      { x: 88, span: 2 },
      { x: 100, span: 2 },
      { x: 128, span: 3 },
      { x: 138, span: 2 },
      { x: 152, span: 2 },
    ],
    boss: true,
  },
];

const BEST_KEY = "paper-runner-best";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function n2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function buildGame(
  host: HTMLElement,
  callbacks: {
    onUi: (s: UiState) => void;
    onHud: (h: Hud) => void;
    setHandles: (h: GameHandles) => void;
  }
): () => void {
  let disposed = false;
  const canvas = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const ctx0 = canvas.getContext("2d");
  if (!ctx0) {
    callbacks.onUi("over");
    return () => {};
  }
  const ctx: CanvasRenderingContext2D = ctx0;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  host.appendChild(canvas);

  let cw = 0;
  let ch = 0;
  let k = 1; // world → screen scale
  let viewW = 0;
  function fit() {
    cw = Math.max(1, host.clientWidth);
    ch = Math.max(1, host.clientHeight);
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    k = Math.max(0.2, Math.min(ch / VIEW_H, cw / 760, 1.6));
    viewW = cw / k;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.scale(k, k);
  }
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(host);
  window.addEventListener("resize", fit);

  // ---- state ----
  let mode: UiState = "ready";
  let levelIndex = 0;
  let best = 0;
  try {
    best = Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    best = 0;
  }
  let score = 0;
  let coins = 0;
  let lives = 3;
  let runPhase = 0;
  let vy = 0;
  let grounded = false;
  let squash = 0;
  let preHop = 0;
  let facing = 1;
  let camX = 0;
  let deadT = 0;
  let clearT = -1;
  let wonBoss = false;
  let bossPassed = false;
  let flashT = 0;

  type Enemy = {
    x: number;
    y: number;
    half: number;
    vx: number;
    cx: number;
    span: number;
    t: number;
  };
  type Coin = { x: number; y: number };
  let solid: boolean[] = [];
  let coinsA: Coin[] = [];
  let enemies: Enemy[] = [];
  let flagTX = 0;
  let bossX = -1;
  let worldW = 0;

  function tileX(px: number) {
    return Math.floor(px / TILE);
  }
  function isSolid(tx: number, ty: number) {
    if (ty >= GROUND_TOP) return false; // treated via grid below
    if (tx < 0 || ty < 0) return false;
    if (tx >= worldW) return true;
    return solid[ty * worldW + tx] === true;
  }

  function loadLevel(idx: number) {
    const L = LEVELS[idx];
    worldW = L.w * TILE;
    solid = new Array(ROWS * L.w).fill(false);

    // ground
    for (let tx = 0; tx < L.w; tx++) {
      const inGap =
        L.gaps?.some(([a, b]) => tx >= a && tx <= b) ?? false;
      if (!inGap) {
        for (let ry = GROUND_TOP; ry < ROWS; ry++) {
          solid[ry * L.w + tx] = true;
        }
      }
    }
    // platforms
    for (const p of L.platforms) {
      for (let x = p.x; x < p.x + p.w; x++) {
        if (x < 0 || x >= L.w) continue;
        solid[p.y * L.w + x] = true;
      }
    }
    coinsA = L.coins.map((c) => ({ x: c.x * TILE + TILE / 2, y: c.y * TILE + TILE / 2 }));
    enemies = L.enemies.map((e) => ({
      x: e.x * TILE + TILE / 2,
      y: GROUND_TOP * TILE - 12,
      half: 13,
      vx: 0,
      cx: e.x * TILE + TILE / 2,
      span: e.span,
      t: Math.random() * 9,
    }));
    flagTX = L.w - 3;
    bossX = L.boss ? L.w - 10 : -1;
    wonBoss = false;
    bossPassed = false;
    clearT = -1;
  }

  function resetRun() {
    levelIndex = 0;
    score = 0;
    coins = 0;
    lives = 3;
    loadLevel(0);
    spawnPlayer();
  }

  function spawnPlayer() {
    px = 2.5 * TILE;
    py = 0;
    vy = 0;
    preHop = 0.06;
    grounded = false;
    squash = 0.25;
    deadT = 0;
    clearT = -1;
  }

  let px = 0;
  let py = 0;

  const ACCEL = 1500;
  const FRICTION = 2100;
  const GRAV = 1550;
  const JUMP_V = -570;
  const STOMP_V = -380;
  const MAXFALL = 920;
  const RUN = 225;

  let keyL = false;
  let keyR = false;
  let keyJ = false;
  let wasJ = false;
  let realDelta = 0;

  function emitHud() {
    callbacks.onHud({
      score,
      coins,
      best,
      speed: levelIndex + 1,
      mult: bossPassed ? 2 : 1,
      shield: false,
      magnet: false,
      x2: false,
    });
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    if (disposed) return;
    realDelta = Math.min(performance.now() / 1000 - lastT, 0.05);
    lastT = performance.now() / 1000;
    if (lastT < 0.02) return;
    const dt = realDelta;
    const t = lastT;

    if (mode === "playing") {
      update(dt);
    }
    if (mode === "ready") {
      px += (0.5 * TILE - px) * Math.min(1, dt * 2);
      py = GROUND_TOP * TILE - P_H + Math.sin(t * 1.6) * 3;
    }
    draw();
    emitHud();
  }

  function update(dt: number) {
    if (deadT > 0) {
      deadT -= dt;
      if (deadT <= 0) {
        lives -= 1;
        if (lives <= 0) {
          gameOver();
          return;
        }
        loadLevel(levelIndex);
        spawnPlayer();
      }
      return;
    }
    if (clearT > 0) {
      clearT -= dt;
      flashT += dt;
      if (clearT <= 0) {
        levelIndex += 1;
        if (levelIndex >= LEVELS.length) {
          mode = "win";
          tone(523, 1046, 0.3, "triangle", 0.12);
          tone(659, 1318, 0.3, "triangle", 0.12, 0.12);
          tone(784, 1568, 0.6, "triangle", 0.14, 0.24);
          saveBest();
          callbacks.onUi("win");
        } else {
          loadLevel(levelIndex);
          spawnPlayer();
          toast(`level ${levelIndex + 1}`);
          tone(440, 660, 0.18, "triangle", 0.1);
        }
      }
      return;
    }

    // ---- horizontal ----
    let ax = 0;
    if (keyL) ax -= 1;
    if (keyR) ax += 1;
    vx += ax * ACCEL * dt;
    if (ax === 0) {
      const s = Math.sign(vx);
      vx -= s * FRICTION * dt;
      if (Math.sign(vx) !== s) vx = 0;
    }
    const maxV = RUN;
    vx = Math.max(-maxV, Math.min(maxV, vx));
    if (Math.abs(vx) > 1) facing = Math.sign(vx);

    // ---- vertical ----
    const jumpBuffered = keyJ && !wasJ;
    if (jumpBuffered && (grounded || preHop > 0)) {
      vy = JUMP_V;
      grounded = false;
      preHop = 0;
      squash = -0.2;
      tone(300, 620, 0.14, "triangle", 0.07);
    }
    if (!keyJ && vy < -160) vy = Math.max(-160, vy * 0.6);
    vy = Math.min(MAXFALL, vy + GRAV * dt);
    wasJ = keyJ;
    if (preHop > 0) preHop -= dt;

    // ---- move & collide ----
    moveX(dt);
    moveY(dt);

    // squash on land
    if (grounded && !prevGrounded) {
      squash = 0.32;
      tone(120, 70, 0.08, "sine", 0.06);
    }
    prevGrounded = grounded;
    squash = Math.max(0, squash - dt * 2.2);

    if (grounded && Math.abs(vx) > 4) {
      runPhase += dt * (1 + Math.abs(vx) / RUN) * 9;
    }
    flashT += dt;

    // ---- coins ----
    const pcx = px + P_W / 2;
    const pcy = py + P_H / 2;
    const kept: Coin[] = [];
    for (const c of coinsA) {
      if (Math.abs(c.x - pcx) < 30 && Math.abs(c.y - pcy) < 34) {
        coins += 1;
        score += 100;
        tone(880, 1320, 0.1, "sine", 0.08);
        tone(1320, 1760, 0.1, "sine", 0.05, 0.05);
        burst(c.x, c.y, 6);
      } else {
        kept.push(c);
      }
    }
    coinsA = kept;

    // ---- enemies ----
    for (const e of enemies) {
      e.t += dt;
      const want = e.x + e.vx * dt + Math.sin(e.t * 0.7) * 0.1;
      const nx2 = Math.max(e.cx - e.span * TILE, Math.min(e.cx + e.span * TILE, want));
      if (Math.abs(nx2 - e.cx) >= e.span * TILE) e.vx = -e.vx;
      e.x = nx2;
      if (e.vx === 0) e.vx = (Math.random() < 0.5 ? -1 : 1) * 55;
      // turn at wall
      const dir = Math.sign(e.vx) || 1;
      const front = e.x + dir * (e.half + 4);
      const below = isSolid(tileX(front), tileX(e.y + 14) + 1);
      if (!below && Math.abs(e.x - e.cx) > 8) e.vx = -e.vx;

      // overlap with player
      if (Math.abs(e.x - pcx) < e.half + 12 && Math.abs(e.y - pcy) < 26) {
        if (py + P_H - e.y < 14 && vy > 0) {
          // stomp
          e.vx = 0;
          score += 200;
          vy = STOMP_V;
          burst(e.x, e.y, 10);
          tone(200, 90, 0.16, "square", 0.1);
        } else {
          die();
          return;
        }
      }
    }

    // ---- boss gate ----
    if (bossX > 0 && !wonBoss) {
      const bx = bossX * TILE;
      if (pcx > bx + 46 && py + P_H < 3.6 * TILE) {
        wonBoss = true;
        bossPassed = true;
        score += 2500;
        coins += 10;
        squash = 0.5;
        tone(120, 880, 0.8, "square", 0.14);
        toast("YOU BEAT THE LEGEND ∞!");
        // clear level
        clearT = 2.6;
        burst(bx, 3 * TILE, 18);
      } else if (pcx > bx - 20 && pcx < bx + 56 && py + P_H < 3.6 * TILE) {
        // fell into boss
        die();
        return;
      }
    }

    // ---- flag ----
    const flagPx = flagTX * TILE + TILE / 2;
    if (pcx > flagPx - 14 && clearT < 0 && deadT <= 0) {
      if (!wonBoss || LEVELS[levelIndex].boss !== true) {
        clearT = 1.8;
        score += 500;
        tone(523, 1046, 0.25, "triangle", 0.11);
        tone(659, 1318, 0.25, "triangle", 0.11, 0.1);
        tone(784, 1568, 0.4, "triangle", 0.12, 0.2);
      } else {
        wonBoss = false;
        bossPassed = true;
        score += 2500;
        coins += 10;
        tone(120, 880, 0.8, "square", 0.14);
        toast("YOU BEAT THE LEGEND ∞!");
      }
    }

    // ---- fall out ----
    if (py > ROWS * TILE + 40) {
      die();
    }

    // ---- camera ----
    const target = px - viewW * 0.42;
    camX += (target - camX) * Math.min(1, dt * 6);
    camX = Math.max(0, Math.min(worldW - viewW, camX));
  }

  let prevGrounded = false;
  let vx = 0;

  function moveX(dt: number) {
    px += vx * dt;
    const half = P_W / 2;
    if (px - half < 0) {
      px = half;
      vx = 0;
    }
    if (px + half > worldW) {
      px = worldW - half;
      vx = 0;
    }
    const minTx = tileX(px - half);
    const maxTx = tileX(px + half);
    const topTy = tileX(py + 2);
    const botTy = tileX(py + P_H - 2);
    for (let ty = topTy; ty <= botTy; ty++) {
      if (isSolid(minTx, ty) && px - half < (minTx + 1) * TILE) {
        px = (minTx + 1) * TILE + half;
        vx = 0;
        break;
      }
      if (isSolid(maxTx, ty) && px + half > maxTx * TILE) {
        px = maxTx * TILE - half;
        vx = 0;
        break;
      }
    }
  }

  function moveY(dt: number) {
    const wasGroundedAt = grounded;
    vy = Math.min(MAXFALL, vy + GRAV * dt * 0);
    py += vy * dt;
    grounded = false;
    const half = P_W / 2;
    const minTx = tileX(px - half + 2);
    const maxTx = tileX(px + half - 2);
    if (vy <= 0) {
      const ty = tileX(py + 2);
      for (let tx = minTx; tx <= maxTx; tx++) {
        if (isSolid(tx, ty) && py + 2 < (ty + 1) * TILE) {
          if (py + 2 < (ty + 1) * TILE + 2) {
            py = (ty + 1) * TILE - 2;
            vy = 0;
            break;
          }
        }
      }
    } else {
      const ty = tileX(py + P_H - 2);
      for (let tx = minTx; tx <= maxTx; tx++) {
        if (isSolid(tx, ty) && py + P_H - 2 >= ty * TILE) {
          if (py + P_H - 2 >= ty * TILE - 0.01) {
            py = ty * TILE - P_H + 2;
            grounded = true;
            vy = 0;
            squash = Math.max(squash, 0.3);
            break;
          }
        }
      }
    }
    if (!wasGroundedAt && grounded) {
      // landing handled in update via prevGrounded
    }
  }

  function die() {
    if (mode !== "playing" || deadT > 0) return;
    deadT = 1.15;
    vy = -420;
    lives -= 0;
    tone(160, 40, 0.5, "sawtooth", 0.13);
    burst(px + P_W / 2, py + P_H / 2, 12);
  }

  function gameOver() {
    mode = "over";
    saveBest();
    callbacks.onUi("over");
  }

  function saveBest() {
    if (score > best) {
      best = score;
      try {
        localStorage.setItem(BEST_KEY, String(best));
      } catch {
        /* ignore */
      }
    }
    emitHud();
  }

  // ---- drawing ----
  function strokeLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    clr: string,
    w = 1.7,
    seedN = 3,
    t = 0
  ) {
    ctx.strokeStyle = clr;
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(2, Math.min(8, Math.round(dist / 8)));
    let px2 = x1;
    let py2 = y1;
    for (let i = 1; i <= steps; i++) {
      const tt = i / steps;
      const bx = x1 + (x2 - x1) * tt;
      const by = y1 + (y2 - y1) * tt;
      const j = (n2((bx * 0.2 + seedN), by * 0.2 + t * 0.4) - 0.5) * 2.6 * w;
      const nx = -(y2 - y1) / (dist || 1);
      const ny = (x2 - x1) / (dist || 1);
      px2 = bx + nx * j;
      py2 = by + ny * j;
      ctx.lineTo(px2, py2);
    }
    ctx.stroke();
    // second lighter pass for hand feel
    if (w >= 1.6) {
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = clr;
      ctx.beginPath();
      ctx.moveTo(x1 + 1, y1 + 1);
      ctx.lineTo(x2 + 1, y2 + 1);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function rectSketch(
    x: number,
    y: number,
    w: number,
    h: number,
    clr: string,
    seedN: number,
    t: number
  ) {
    strokeLine(x, y, x + w, y, clr, 1.6, seedN, t);
    strokeLine(x + w, y, x + w, y + h, clr, 1.6, seedN + 1, t);
    strokeLine(x + w, y + h, x, y + h, clr, 1.6, seedN + 2, t);
    strokeLine(x, y + h, x, y, clr, 1.6, seedN + 3, t);
  }

  function circleSketch(
    cx: number,
    cy: number,
    r: number,
    clr: string,
    seedN: number,
    t: number,
    fill?: string
  ) {
    const R = mulberry32(seedN);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = clr;
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    const segs = 14;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const rr = r + (R() - 0.5) * 3;
      const xp = cx + Math.cos(a) * rr;
      const yp = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(xp, yp);
      else ctx.lineTo(xp, yp);
    }
    ctx.stroke();
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0.3, Math.PI * 1.7);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawGround() {
    for (let tx = 0; tx < tileX(worldW) + 1; tx++) {
      for (let ry = GROUND_TOP; ry < ROWS; ry++) {
        if (!isSolid(tx, ry)) continue;
        const x = tx * TILE;
        const y = ry * TILE;
        ctx.fillStyle = "#f4eed9";
        ctx.fillRect(x, y, TILE, TILE);
        rectSketch(x, y, TILE, TILE, COLORS.inkSoft, tx * 7 + ry, flashT);
        if (ry === GROUND_TOP) {
          strokeLine(x, y + 1, x + TILE, y + 1, COLORS.ink, 2.1, tx * 3, flashT);
        }
        ctx.fillStyle = "rgba(58,63,75,0.07)";
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(
            x + 4 + ((tx * 13 + i * 11) % (TILE - 10)),
            y + 6 + ((ry * 17 + i * 23) % (TILE - 12)),
            2,
            3
          );
        }
      }
    }
    // gap bottom: sketch a cliff doodle
    if (LEVELS[levelIndex].gaps) {
      for (const [a] of LEVELS[levelIndex].gaps!) {
        const gx = a * TILE;
        const gy = GROUND_TOP * TILE;
        ctx.strokeStyle = "rgba(58,63,75,0.35)";
        ctx.lineWidth = 1.4;
        for (let i = 0; i < 4; i++) {
          strokeLine(
            gx + i * 8,
            gy + 4,
            gx + i * 8 + 4,
            gy + i * 4 + 6,
            "rgba(58,63,75,0.4)",
            1.2,
            11 + i,
            flashT
          );
        }
        strokeLine(gx + 2, gy + 2, gx + 2, gy, "rgba(58,63,75,0.5)", 1.4, 40, flashT);
      }
    }
  }

  function drawPlatform(p: { x: number; y: number; w: number }, t: number) {
    const x = p.x * TILE;
    const y = p.y * TILE;
    ctx.fillStyle = "#f4eed9";
    ctx.fillRect(x, y, p.w * TILE, TILE);
    rectSketch(x, y, p.w * TILE, TILE, COLORS.ink, p.x * 5 + p.y, t);
    strokeLine(x, y + 1, x + p.w * TILE, y + 1, COLORS.ink, 2.1, p.x * 3, t);
    // tape corners
    ctx.fillStyle = "rgba(232,165,58,0.5)";
    ctx.save();
    ctx.translate(x + p.w * TILE - 8, y);
    ctx.rotate(-0.5);
    ctx.fillRect(-4, -3, 10, 5);
    ctx.restore();
  }

  function drawCoin(c: Coin, t: number, gone: boolean) {
    if (gone) return;
    const bob = Math.sin(t * 3 + c.x * 0.05) * 2;
    const cx = c.x;
    const cy = c.y + bob;
    const spin = Math.max(0.18, Math.abs(Math.sin(t * 2.4 + c.x)));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(spin, 1);
    circleSketch(0, 0, 10, COLORS.goldDark, 7 + c.x, t, COLORS.gold);
    ctx.strokeStyle = COLORS.goldDark;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.quadraticCurveTo(4, 0, 0, 5);
    ctx.stroke();
    ctx.restore();
    // sparkle
    if (n2(c.x, Math.floor(t * 3)) > 0.82) {
      ctx.strokeStyle = COLORS.goldDark;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 13);
      ctx.lineTo(cx, cy - 17);
      ctx.moveTo(cx - 4, cy - 15);
      ctx.lineTo(cx + 4, cy - 15);
      ctx.stroke();
    }
  }

  function drawEnemy(e: Enemy, t: number) {
    if (e.vx === 0) {
      // stomped splat
      ctx.fillStyle = "rgba(58,63,75,0.8)";
      ctx.beginPath();
      ctx.ellipse(e.x, e.y - 2, 15, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    const wob = Math.sin(e.t * 8) * 1.5;
    const dir = Math.sign(e.vx) || 1;
    ctx.save();
    ctx.translate(e.x, e.y - 6 + wob * 0.2);
    circleSketch(0, 0, 17, COLORS.ink, 9 + e.x, t, "#efece2");
    // angry eyes
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-8, -6);
    ctx.lineTo(-2, -3);
    ctx.moveTo(8, -6);
    ctx.lineTo(2, -3);
    ctx.stroke();
    ctx.fillStyle = COLORS.ink;
    ctx.beginPath();
    ctx.arc(-5, -1, 2, 0, Math.PI * 2);
    ctx.arc(5, -1, 2, 0, Math.PI * 2);
    ctx.fill();
    // mouth
    ctx.beginPath();
    ctx.moveTo(-4, 5);
    ctx.lineTo(0, 7);
    ctx.lineTo(4, 5);
    ctx.stroke();
    // little feet
    ctx.lineWidth = 1.5;
    strokeLine(0, 12, 0, 15, COLORS.ink, 1.5, 12, t);
    strokeLine(dir * 5, 11, dir * 5, 14, COLORS.ink, 1.5, 13, t);
    ctx.restore();
  }

  function drawPlayer(t: number) {
    ctx.save();
    const facingX = facing;
    const x = px + P_W / 2 + (clearT > 0 ? Math.sin(flashT * 30) * 0 : 0);
    const y = py + P_H;
    ctx.translate(x, y);
    if (clearT > 0) {
      ctx.globalAlpha = 1;
    }
    const sq = Math.sin(Math.min((squash > 0 ? squash : 0) * 3.1, Math.PI));
    const sqx = 1 + (squash > 0 ? sq * 0.2 : -Math.abs(squash) * 0.2);
    const sqy = 1 + (squash > 0 ? -sq * 0.14 : Math.abs(squash) * 0.14);
    ctx.scale(facingX * sqx, sqy);
    if (facingX < 0) ctx.rotate(-Math.abs(vx) * 0.0004);

    const legA = grounded ? Math.sin(runPhase) * 0.6 : 0.4;
    const legB = grounded ? Math.sin(runPhase + Math.PI) * 0.6 : -0.4;
    const armA = grounded ? Math.sin(runPhase + Math.PI) * 0.7 : -1.6;
    const armB = grounded ? Math.sin(runPhase) * 0.7 : -1.8;

    // legs
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 2.6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-2, -14);
    ctx.lineTo(-3 + legA * 6, -2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, -14);
    ctx.lineTo(3 + legB * 6, -2);
    ctx.stroke();
    // feet
    ctx.fillStyle = COLORS.red;
    ctx.beginPath();
    ctx.ellipse(-3 + legA * 6 + 3, 0, 4.5, 2.6, 0, 0, Math.PI * 2);
    ctx.ellipse(3 + legB * 6 + 3, 0, 4.5, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // body
    ctx.fillStyle = "rgba(49,81,194,0.16)";
    ctx.beginPath();
    ctx.roundRect(-8, -30, 18, 18, 4);
    ctx.fill();
    rectSketch(-8, -30, 18, 18, COLORS.accent, 30, t);
    // belt
    ctx.strokeStyle = COLORS.red;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-8, -19);
    ctx.lineTo(10, -19);
    ctx.stroke();

    // arms
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-7, -27);
    ctx.lineTo(-10 + armA * 5, -22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(9, -27);
    ctx.lineTo(12 + armB * 5, -22);
    ctx.stroke();

    // head
    ctx.translate(1, -34);
    circleSketch(0, 0, 11, COLORS.ink, 4, t, "#fffdf6");
    // eyes
    ctx.fillStyle = COLORS.ink;
    ctx.beginPath();
    ctx.arc(-3.5, -2, 1.9, 0, Math.PI * 2);
    ctx.arc(3.5, -2, 1.9, 0, Math.PI * 2);
    ctx.fill();
    // smile
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 2, 4, 0.15, Math.PI - 0.15);
    ctx.stroke();
    // hair scribbles
    ctx.strokeStyle = COLORS.accent2;
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 3; i++) {
      beginSketch();
      ctx.moveTo(-6 + i * 5, -8);
      ctx.lineTo(-8 + i * 6, -12);
      ctx.stroke();
    }
    ctx.restore();
  }

  function beginSketch() {
    ctx.beginPath();
  }

  function drawFlag(t: number) {
    const fx = flagTX * TILE + TILE / 2;
    const baseY = GROUND_TOP * TILE;
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(fx, baseY);
    ctx.lineTo(fx, baseY - 92);
    ctx.stroke();
    // waving flag
    const wave = Math.sin(t * 4) * 3;
    ctx.fillStyle = COLORS.red;
    ctx.beginPath();
    ctx.moveTo(fx, baseY - 92);
    ctx.quadraticCurveTo(fx + 22, baseY - 88 + wave, fx + 34, baseY - 78 + wave);
    ctx.quadraticCurveTo(fx + 22, baseY - 66 + wave, fx, baseY - 62);
    ctx.closePath();
    ctx.fill();
    strokeLine(fx, baseY - 92, fx + 34, baseY - 78 + wave, COLORS.red, 1.6, 21, t);
    // star on flag
    ctx.fillStyle = "#fffdf6";
    ctx.beginPath();
    ctx.arc(fx + 16, baseY - 77 + wave, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBoss(t: number) {
    const bx = bossX * TILE + TILE / 2;
    const baseY = GROUND_TOP * TILE;
    ctx.save();
    ctx.translate(bx + 20, baseY);
    // emotion
    const angry = !wonBoss;
    // body
    ctx.fillStyle = "rgba(49,81,194,0.14)";
    ctx.beginPath();
    ctx.roundRect(-70, -104, 130, 110, 12);
    ctx.fill();
    rectSketch(-70, -104, 130, 110, COLORS.accent, 200, t);
    // chest ∞
    ctx.strokeStyle = COLORS.red;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(8, -66, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(24, -66, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = COLORS.red;
    ctx.font = "600 15px Caveat, cursive";
    ctx.textAlign = "center";
    ctx.fillText("ANANVAY PANDEY", 0, -118 - 8);
    ctx.fillText("the ∞ legend", 16, -118 + 8 - 4);
    // head
    ctx.translate(14, -120);
    circleSketch(0, 0, 30, COLORS.ink, 55, t, "#fffdf6");
    // furious brows
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-22, -12);
    ctx.lineTo(-4, -2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(22, -12);
    ctx.lineTo(4, -2);
    ctx.stroke();
    // eyes
    ctx.fillStyle = COLORS.ink;
    ctx.beginPath();
    ctx.arc(-12, 6, 3.4, 0, Math.PI * 2);
    ctx.arc(12, 6, 3.4, 0, Math.PI * 2);
    ctx.fill();
    // roaring mouth
    if (angry) {
      ctx.strokeStyle = COLORS.ink;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(0, 20, 10, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = COLORS.ink;
      ctx.beginPath();
      ctx.arc(0, 16, 8, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
    ctx.restore();
    // "jump over me" arrow wobble
    if (!wonBoss) {
      const yy = 4.1 * TILE + Math.sin(t * 3) * 4;
      ctx.strokeStyle = COLORS.red;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(bx, yy);
      ctx.lineTo(bx, yy - 26);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = COLORS.red;
      ctx.font = "600 15px Caveat, cursive";
      ctx.textAlign = "center";
      ctx.fillText("jump over!", bx, yy - 34);
    }
  }

  function drawPaper() {
    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(0, 0, viewW, VIEW_H);
    // ruled horizontal lines
    ctx.strokeStyle = COLORS.ruled;
    ctx.lineWidth = 1;
    const off = camX % 32;
    for (let y = 44; y < VIEW_H; y += 32) {
      ctx.beginPath();
      ctx.moveTo(-off, y);
      ctx.lineTo(viewW + off, y);
      ctx.stroke();
    }
    // red margin line (notebook)
    ctx.strokeStyle = COLORS.margin;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-off + 36, 0);
    ctx.lineTo(-off + 36, VIEW_H);
    ctx.stroke();
    // corner doodles
    ctx.strokeStyle = "rgba(58,63,75,0.16)";
    ctx.lineWidth = 1.4;
    beginSketch();
    ctx.moveTo(26, 22);
    ctx.lineTo(60, 22);
    ctx.quadraticCurveTo(72, 22, 72, 34);
    ctx.stroke();
  }

  function draw() {
    // clear
    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(0, 0, cw / k, ch / k);
    ctx.save();
    // letterbox vertical center
    const sy = (ch / k - VIEW_H) / 2;
    ctx.translate(0, sy > 0 ? sy : 0);
    ctx.translate(-camX, 0);
    drawPaper();
    drawGround();
    for (const p of LEVELS[levelIndex].platforms) {
      drawPlatform(p, flashT);
    }
    if (bossX > 0 && !wonBoss) drawBoss(flashT);
    if (bossX > 0) {
      // boss zone fill sketch
      ctx.strokeStyle = "rgba(207,74,51,0.4)";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(bossX * TILE - 20, 0, 96, GROUND_TOP * TILE);
      ctx.strokeStyle = "rgba(207,74,51,0.5)";
      ctx.font = "600 16px Caveat, cursive";
      ctx.textAlign = "center";
      ctx.fillText("BOSS", bossX * TILE + 28, 26);
      ctx.fillText("gate", bossX * TILE + 28, 46);
    }
    for (const c of coinsA) drawCoin(c, flashT, false);
    for (const e of enemies) drawEnemy(e, flashT);
    drawFlag(flashT);
    drawPlayer(flashT);

    // paint splashes
    for (const p of particles) {
      p.x += p.vx * 0.016;
      p.y += p.vy * 0.016;
      p.vy += 220 * 0.016;
      p.life -= 0.04;
      ctx.fillStyle = p.clr;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();

    // vignette edges (paper shading)
    const g = ctx.createRadialGradient(
      cw / 2 / k,
      ch / 2 / k,
      Math.min(cw, ch) / 2 / k * 0.7,
      cw / 2 / k,
      ch / 2 / k,
      Math.max(cw, ch) / 2 / k * 1.1
    );
    g.addColorStop(0, "rgba(60,50,30,0)");
    g.addColorStop(1, "rgba(60,50,30,0.12)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw / k, ch / k);

    // HUD paper strip
    ctx.fillStyle = "rgba(251,247,236,0.85)";
    ctx.strokeStyle = COLORS.inkSoft;
    ctx.lineWidth = 1.4;
    ctx.strokeRect(8, 8, 132, 34);
    ctx.fillRect(8, 8, 132, 34);
    ctx.fillStyle = COLORS.ink;
    ctx.font = "600 16px Caveat, cursive";
    ctx.textAlign = "left";
    ctx.fillText(`level ${levelIndex + 1}`, 16, 30);
    ctx.fillStyle = COLORS.red;
    ctx.fillText("♥".repeat(Math.max(0, lives)), viewW - 78, 30);
    ctx.fillStyle = COLORS.goldDark;
    ctx.fillText(`★ ${coins}`, viewW - 150, 30);

    // toast
    if (toastText && toastT > 0) {
      ctx.fillStyle = COLORS.ink;
      ctx.font = "700 24px Caveat, cursive";
      ctx.textAlign = "center";
      ctx.globalAlpha = Math.min(1, toastT);
      ctx.fillText(toastText, viewW / 2, 60);
      ctx.globalAlpha = 1;
    }
    // level clear banner
    if (clearT > 0) {
      ctx.fillStyle = "rgba(251,247,236,0.9)";
      ctx.strokeStyle = COLORS.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(viewW / 2 - 90, VIEW_H / 2 - 30, 180, 60);
      ctx.fillRect(viewW / 2 - 90, VIEW_H / 2 - 30, 180, 60);
      ctx.fillStyle = COLORS.accent2;
      ctx.font = "700 26px Caveat, cursive";
      ctx.textAlign = "center";
      const lbl = wonBoss && LEVELS[levelIndex].boss ? "LEGEND DOWN!" : "LEVEL CLEAR!";
      ctx.fillText(lbl, viewW / 2, VIEW_H / 2 + 6);
    }
  }

  let toastText = "";
  let toastT = 0;
  function toast(text: string) {
    toastText = text;
    toastT = 2.2;
  }

  const particles: { x: number; y: number; vx: number; vy: number; r: number; life: number; clr: string }[] = [];
  function burst(x: number, y: number, n: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 40 + Math.random() * 120;
      particles.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 60,
        r: 2 + Math.random() * 3,
        life: 0.6 + Math.random() * 0.4,
        clr: Math.random() < 0.5 ? COLORS.accent2 : COLORS.red,
      });
    }
    if (particles.length > 120) particles.splice(0, particles.length - 120);
  }

  // ---- input ----
  function onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
      return;
    const c = e.code;
    if (c === "ArrowLeft" || c === "KeyA") {
      e.preventDefault();
      keyL = true;
    } else if (c === "ArrowRight" || c === "KeyD") {
      e.preventDefault();
      keyR = true;
    } else if (c === "Space" || c === "ArrowUp" || c === "KeyW") {
      e.preventDefault();
      keyJ = true;
      if (mode === "ready" || mode === "over") start();
      else if (mode === "paused") resume();
    } else if (c === "Enter") {
      e.preventDefault();
      if (mode === "ready" || mode === "over" || mode === "win") start();
      else if (mode === "paused") resume();
    } else if (c === "KeyP" || c === "Escape") {
      togglePause();
    }
  }
  function onKeyUp(e: KeyboardEvent) {
    const c = e.code;
    if (c === "ArrowLeft" || c === "KeyA") keyL = false;
    else if (c === "ArrowRight" || c === "KeyD") keyR = false;
    else if (c === "Space" || c === "ArrowUp" || c === "KeyW") keyJ = false;
  }
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKeyUp);

  // ---- public handles ----
  function start() {
    resetRun();
    mode = "playing";
    tone(420, 840, 0.16, "triangle", 0.07);
    callbacks.onUi("playing");
    emitHud();
  }
  function resume() {
    if (mode !== "paused") return;
    mode = "playing";
    lastT = performance.now() / 1000;
    callbacks.onUi("playing");
  }
  function togglePause() {
    if (mode === "playing") {
      mode = "paused";
      callbacks.onUi("paused");
    } else if (mode === "paused") {
      resume();
    }
  }
  function jump() {
    keyJ = true;
    start();
  }
  function lane(dir: -1 | 0 | 1) {
    keyL = dir === -1;
    keyR = dir === 1;
  }

  callbacks.setHandles({ start, togglePause, resume, restart: start, jump, lane });

  resetRun();
  emitHud();

  let raf = 0;
  let lastT = performance.now() / 1000;
  raf = requestAnimationFrame(tick);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("resize", fit);
    ro.disconnect();
    if (canvas.parentElement === host) host.removeChild(canvas);
  };
}

// ---- audio ----
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
          · {leaderboardEnabled ? "every visitor" : "this device"}
        </span>
      </p>
      {state === "loading" && (
        <p className="font-hand text-lg text-faint">loading…</p>
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
  const [ui, setUi] = useState<UiState>("ready");
  const [hud, setHud] = useState<Hud>({
    score: 0,
    coins: 0,
    best: 0,
    speed: 1,
    mult: 1,
    shield: false,
    magnet: false,
    x2: false,
  });
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
    let disposed = false;
    const destroy = buildGame(host, {
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
    return () => {
      disposed = true;
      handlesRef.current = null;
      destroy();
    };
  }, []);

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
    if (ui !== "over" && ui !== "win") return;
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
      } catch {
        if (!active) return;
        setSaveState("failed");
      }
    })();
    return () => {
      active = false;
    };
  }, [ui, hud.score, hud.coins]);

  const chips = [
    ["score", String(hud.score)],
    ["coins", `${hud.coins}¢`],
    ["best", String(hud.best)],
    ["level", String(hud.speed)],
  ];

  return (
    <div className="relative mx-auto max-w-6xl px-4">
      <div className="overflow-hidden rounded-2xl border-2 border-dashed border-borderish bg-background shadow-sm">
        <div
          className="relative aspect-[16/9] w-full sm:aspect-auto sm:h-[540px]"
          ref={hostRef}
        >
          <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
            {chips.map(([label, value]) => (
              <span
                key={label}
                className="rounded-full border border-accent/30 bg-background/80 px-2.5 py-0.5 font-hand text-lg text-foreground backdrop-blur-sm"
              >
                {label} <span className="text-muted">{value}</span>
              </span>
            ))}
          </div>
          <div className="absolute right-3 top-3 z-10 flex gap-1.5">
            <button
              type="button"
              aria-label="toggle sound"
              onClick={() => {
                muted = !muted;
              }}
              className="rounded-full border border-accent/30 bg-background/80 px-2.5 py-0.5 font-hand text-lg text-accent transition-colors hover:bg-accent/10"
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              type="button"
              aria-label="pause"
              onClick={() => handlesRef.current?.togglePause()}
              className="rounded-full border border-accent/30 bg-background/80 px-2.5 py-0.5 font-hand text-lg text-accent transition-colors hover:bg-accent/10"
            >
              {ui === "paused" ? "▶" : "⏸"}
            </button>
          </div>

          {/* on-canvas controls for touch */}
          {(ui === "playing" || ui === "paused") && (
            <>
              <button
                type="button"
                aria-label="run left"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handlesRef.current?.lane(-1);
                }}
                onPointerUp={() => handlesRef.current?.lane(0)}
                onPointerLeave={() => handlesRef.current?.lane(0)}
                onPointerCancel={() => handlesRef.current?.lane(0)}
                className="absolute bottom-4 left-4 z-10 h-14 w-14 rounded-full border-2 border-dashed border-accent/40 bg-background/70 font-hand text-2xl text-accent backdrop-blur-sm select-none touch-none"
              >
                ◀
              </button>
              <button
                type="button"
                aria-label="run right"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handlesRef.current?.lane(1);
                }}
                onPointerUp={() => handlesRef.current?.lane(0)}
                onPointerLeave={() => handlesRef.current?.lane(0)}
                onPointerCancel={() => handlesRef.current?.lane(0)}
                className="absolute bottom-4 left-20 z-10 h-14 w-14 rounded-full border-2 border-dashed border-accent/40 bg-background/70 font-hand text-2xl text-accent backdrop-blur-sm select-none touch-none"
              >
                ▶
              </button>
              <button
                type="button"
                aria-label="jump"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handlesRef.current?.jump();
                }}
                className="absolute bottom-4 right-4 z-10 h-14 w-14 rounded-full border-2 border-dashed border-gold/50 bg-background/70 font-hand text-2xl text-gold backdrop-blur-sm select-none touch-none"
              >
                ⤒
              </button>
            </>
          )}

          {ui === "ready" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/85 p-6 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl border-2 border-dashed border-borderish bg-surface p-6 text-center">
                <p className="font-hand text-4xl font-bold text-foreground">
                  paper runner
                </p>
                <p className="mt-1 font-hand text-xl text-muted">
                  pen &amp; paper platformer
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  stomp the ink blobs, snatch the <span className="text-gold">★ stars</span>,
                  and leap the <span className="text-accent">∞ legend</span> at the end.
                  five hand-drawn levels.
                </p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={18}
                  placeholder="your name"
                  aria-label="your name"
                  className="mt-4 w-full rounded-xl border-2 border-dashed border-borderish bg-background px-4 py-2 text-center font-hand text-2xl text-foreground outline-none focus:border-accent/60"
                />
                <button
                  type="button"
                  onClick={() => handlesRef.current?.start()}
                  className="mt-4 w-full rounded-xl border-2 border-dashed border-accent bg-accent/10 px-4 py-2 font-hand text-2xl font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  draw — start
                </button>
                <p className="mt-3 font-mono text-sm text-faint">
                  arrows / WASD to run · space to jump
                </p>
              </div>
            </div>
          )}

          {ui === "paused" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 p-6 backdrop-blur-sm">
              <div className="text-center">
                <p className="font-hand text-4xl font-semibold text-foreground">paused</p>
                <p className="mt-1 font-mono text-sm text-faint">space / P to resume</p>
              </div>
            </div>
          )}

          {ui === "over" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/85 p-6 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl border-2 border-dashed border-borderish bg-surface p-6 text-center">
                <p className="font-hand text-5xl font-bold text-ink-red">splat!</p>
                <p className="mt-2 text-lg text-muted">
                  the ink ran out.
                </p>
                <p className="mt-2 font-hand text-2xl text-foreground">
                  score <span className="text-accent">{hud.score}</span> · coins{" "}
                  <span className="text-gold">{hud.coins}¢</span>
                </p>
                <p className="mt-1 font-mono text-sm text-faint">
                  {saveState === "saving" && "saving score…"}
                  {saveState === "saved" && "✓ saved to the board"}
                  {saveState === "failed" && "couldn't save this run"}
                </p>
                <button
                  type="button"
                  onClick={() => handlesRef.current?.start()}
                  className="mt-4 w-full rounded-xl border-2 border-dashed border-accent bg-accent/10 px-4 py-2 font-hand text-2xl font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  draw again
                </button>
              </div>
            </div>
          )}

          {ui === "win" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/85 p-6 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl border-2 border-dashed border-borderish bg-surface p-6 text-center">
                <p className="font-hand text-5xl font-bold text-gold">
                  the legend falls!
                </p>
                <p className="mt-2 text-lg text-muted">
                  you jumped clean over ANANVAY PANDEY ∞ and finished every level.
                </p>
                <p className="mt-2 font-hand text-2xl text-foreground">
                  score <span className="text-accent">{hud.score}</span> · coins{" "}
                  <span className="text-gold">{hud.coins}¢</span>
                </p>
                <p className="mt-1 font-mono text-sm text-faint">
                  {saveState === "saving" && "saving score…"}
                  {saveState === "saved" && "✓ saved to the board"}
                  {saveState === "failed" && "couldn't save this run"}
                </p>
                <button
                  type="button"
                  onClick={() => handlesRef.current?.start()}
                  className="mt-4 w-full rounded-xl border-2 border-dashed border-accent bg-accent/10 px-4 py-2 font-hand text-2xl font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  draw again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-dashed border-borderish bg-surface p-4">
          <BoardPanel state={boardState} list={board} current={name} />
        </div>
        <div className="rounded-2xl border-2 border-dashed border-borderish bg-surface p-4">
          <p className="mb-2 font-hand text-lg text-foreground">how to play</p>
          <ul className="space-y-1 text-sm text-muted">
            <li>· run with ← → / A D</li>
            <li>· jump with space / ↑ / W</li>
            <li>· land on ink blobs to stomp them</li>
            <li>· the ∞ boss guards level 5 — jump over it</li>
            <li>· grab ★ stars for coins &amp; score</li>
          </ul>
        </div>
      </div>
    </div>
  );
}