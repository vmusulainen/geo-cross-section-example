#!/usr/bin/env node
// Generates open-source geological hatch PNG tiles for the example app.
// Each tile is 64×64 px, dark marks on transparent background.
// Run: node scripts/generate-hatches.mjs
// Output: public/hatches/<code>.png

import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/hatches')
mkdirSync(OUT, { recursive: true })

const S = 64      // tile size in px
const C = 'rgba(0,0,0,0.55)'   // mark colour

function make(code, drawFn) {
  const canvas = createCanvas(S, S)
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, S, S)
  ctx.strokeStyle = C
  ctx.fillStyle   = C
  ctx.lineWidth   = 1
  drawFn(ctx)
  const buf = canvas.toBuffer('image/png')
  writeFileSync(resolve(OUT, `${code}.png`), buf)
  console.log(`  ${code}.png`)
}

// ── helpers ──────────────────────────────────────────────────────────────────

function hlines(ctx, gap = 8, lw = 1) {
  ctx.lineWidth = lw
  for (let y = gap / 2; y < S; y += gap) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke()
  }
}

function vlines(ctx, gap = 8, lw = 1) {
  ctx.lineWidth = lw
  for (let x = gap / 2; x < S; x += gap) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, S); ctx.stroke()
  }
}

function diagLines(ctx, gap = 10, dir = 1, lw = 1) {
  // dir=1 → '\', dir=-1 → '/'
  ctx.lineWidth = lw
  for (let i = -S; i < S * 2; i += gap) {
    ctx.beginPath()
    if (dir === 1) { ctx.moveTo(i, 0); ctx.lineTo(i + S, S) }
    else           { ctx.moveTo(i + S, 0); ctx.lineTo(i, S) }
    ctx.stroke()
  }
}

function dots(ctx, gap = 10, r = 1.5) {
  for (let y = gap / 2; y < S; y += gap) {
    for (let x = gap / 2; x < S; x += gap) {
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }
  }
}

function circles(ctx, gap = 16, r = 5, lw = 1) {
  ctx.lineWidth = lw
  for (let y = gap / 2; y < S; y += gap) {
    for (let x = gap / 2; x < S; x += gap) {
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke()
    }
  }
}

function brick(ctx, bw = 32, bh = 12, lw = 1, offset = 16) {
  ctx.lineWidth = lw
  let row = 0
  for (let y = 0; y < S + bh; y += bh, row++) {
    const ox = (row % 2) * offset
    // horizontal line
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke()
    // vertical joints
    for (let x = ox; x < S + bw; x += bw) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + bh); ctx.stroke()
    }
  }
}

function wavyLines(ctx, gap = 10, amp = 3, lw = 1) {
  ctx.lineWidth = lw
  for (let y = gap / 2; y < S; y += gap) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= S; x += 4) {
      const wy = y + Math.sin(x / (S / (2 * Math.PI * 2))) * amp
      ctx.lineTo(x, wy)
    }
    ctx.stroke()
  }
}

function crosshatch(ctx, gap = 10, lw = 1) {
  ctx.lineWidth = lw
  diagLines(ctx, gap, 1, lw)
  diagLines(ctx, gap, -1, lw)
}

function dashes(ctx, gap = 10, len = 6, dir = 1, lw = 1) {
  ctx.lineWidth = lw
  for (let i = -S; i < S * 2; i += gap) {
    for (let j = 0; j < S; j += len * 2) {
      ctx.beginPath()
      if (dir === 1) {
        ctx.moveTo(i + j * 0.5,          j)
        ctx.lineTo(i + (j + len) * 0.5,  j + len)
      } else {
        ctx.moveTo(i + S - j * 0.5,          j)
        ctx.lineTo(i + S - (j + len) * 0.5,  j + len)
      }
      ctx.stroke()
    }
  }
}

// ── Pattern definitions by geological layer type ──────────────────────────────

console.log('Generating hatch tiles…')

// 002 — Anthropogenic mixed fill — dense crosshatch
make('002', ctx => crosshatch(ctx, 8, 1))

// 003 — Topsoil — horizontal lines + dots
make('003', ctx => { hlines(ctx, 10, 1); dots(ctx, 10, 1.2) })

// 004 — Modern lacustrine/bog — wavy horizontal lines
make('004', ctx => wavyLines(ctx, 10, 3, 1))

// 005 — Modern alluvial, small rivers — fine sand dots
make('005', ctx => dots(ctx, 8, 1.4))

// 006 — Modern alluvial — coarser sand dots
make('006', ctx => dots(ctx, 10, 2))

// 007 — Landslide — broken diagonal dashes
make('007', ctx => dashes(ctx, 14, 7, 1, 1.2))

// 017 — Alluvial-deluvial — dots + diagonal lines
make('017', ctx => { diagLines(ctx, 14, -1, 1); dots(ctx, 14, 1.5) })

// 020 — Alluvial I (1st terrace) — sand
make('020', ctx => dots(ctx, 9, 1.8))

// 021 — Lacustrine/bog — spaced horizontal lines
make('021', ctx => hlines(ctx, 8, 1))

// 024 — Alluvial II — sand with light diagonals
make('024', ctx => { dots(ctx, 10, 1.6); diagLines(ctx, 20, 1, 0.5) })

// 026 — Late Pleistocene cover — diagonal lines (loess)
make('026', ctx => diagLines(ctx, 8, -1, 1))

// 030 — Alluvial III — sand (slightly coarser)
make('030', ctx => dots(ctx, 11, 2.2))

// 038 — Moscow Glacial Horizon — till: short dashes + dots
make('038', ctx => { hlines(ctx, 10, 0.7); dots(ctx, 16, 2.5) })

// 039 — Glacial till (moraine) — pebble circles
make('039', ctx => circles(ctx, 18, 6, 1))

// 045 — Moscow–Dnieper Glacial — denser till
make('045', ctx => { diagLines(ctx, 12, 1, 0.8); dots(ctx, 12, 2) })

// 049 — Dnieper glaciation till — dense moraine circles
make('049', ctx => circles(ctx, 14, 4.5, 1))

// 057 — Fluvioglacial — open gravel circles + dots
make('057', ctx => { circles(ctx, 20, 7, 1); dots(ctx, 10, 1) })

// 071 — Lower Cretaceous — fine horizontal lines + scattered dots
make('071', ctx => { hlines(ctx, 6, 0.8); dots(ctx, 20, 1.5) })

// 073 — Upper Jurassic, Volgian — dense horizontal lines (shale)
make('073', ctx => hlines(ctx, 5, 1.2))

// 075 — Upper Jurassic, Oxfordian — horizontal lines
make('075', ctx => hlines(ctx, 8, 1))

// 076 — Upper Jurassic, Callovian — brick (limestone)
make('076', ctx => brick(ctx, 32, 14, 1, 16))

// 078 — Middle Jurassic, Bathonian — clay lines (closer)
make('078', ctx => hlines(ctx, 6, 1.5))

// 083 — Eluvial, Upper Carboniferous — irregular circles
make('083', ctx => { circles(ctx, 20, 6, 1); dots(ctx, 20, 2) })

// 094 — Upper Carboniferous, Perkhurov — brick + dots
make('094', ctx => { brick(ctx, 28, 12, 1, 14); dots(ctx, 14, 1.2) })

// 095 — Upper Carboniferous, Neverov — standard brick
make('095', ctx => brick(ctx, 30, 13, 1, 15))

// 097 — Upper Carboniferous, Ratmirov — brick (tighter)
make('097', ctx => brick(ctx, 26, 11, 1, 13))

// 098 — Upper Carboniferous, Voskresenka — brick variant with inner dots
make('098', ctx => { brick(ctx, 32, 14, 1, 16); dots(ctx, 32, 2) })

// 100 — Upper Carboniferous, Suvorov — brick
make('100', ctx => brick(ctx, 28, 12, 1.2, 14))

// 105 — Middle Carboniferous, Podolsk-Myachkovo — dense brick
make('105', ctx => brick(ctx, 24, 10, 1.2, 12))

// 107 — Lower Carboniferous, Kashira — very dense brick
make('107', ctx => brick(ctx, 20, 9, 1.5, 10))

console.log('Done — 30 tiles written to public/hatches/')
