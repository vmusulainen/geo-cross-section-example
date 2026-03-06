import { CrossSection } from 'geo-cross-section'
import type { CrossSectionData } from 'geo-cross-section'
import baseData from './data.json'

// ── Hatch image URLs ──────────────────────────────────────────────────────────
// Load all PNG tiles from public/hatches/ as asset URLs via Vite glob.
// Each key is the zero-padded code matching layerInfo[].hatchCode (e.g. "038").
const hatchModules = import.meta.glob<string>(
  '/public/hatches/*.png',
  { eager: true, query: '?url', import: 'default' },
)
const hatchUrls: Record<string, string> = {}
for (const [path, url] of Object.entries(hatchModules)) {
  const m = path.match(/(\d+)\.png$/)
  if (m) hatchUrls[m[1]] = url
}

// ── Merge hatch URLs into layerInfo ──────────────────────────────────────────
// baseData.layerInfo stores a hatchCode helper field (not a URL).
// We resolve it to the actual asset URL here before passing to the library.
const data: CrossSectionData = {
  series: baseData.series,
  layerInfo: baseData.layerInfo.map(l => ({
    id:    l.id,
    name:  l.name,
    color: l.color,
    hatch: hatchUrls[l.hatchCode],
  })),
  refLines: [
    { distance: 15,  lat: 59.9341, lon: 30.3351 },
    { distance: 250,  lat: 59.9318, lon: 30.3612 },
    { distance: 370,  lat: 59.9302, lon: 30.3874, label: 'Borehole BH-3' },
    { distance: 525,  lat: 59.9287, lon: 30.4089 },
  ],
}

// ── CrossSection ──────────────────────────────────────────────────────────────
const container = document.getElementById('container') as HTMLElement

new CrossSection(container, data, {
  padding: { top: 16, right: 16, bottom: 36, left: 60 },
  measurementUnit: 'm',
  hatchPatternSize: 64,

  axes: {
    axisColor:  'rgba(180,180,180,0.7)',
    gridColor:  'rgba(120,120,120,0.18)',
    labelColor: 'rgba(200,200,200,0.9)',
  },

  layer: {
    borderColor: 'rgba(40,40,40,0.4)',
  },

  marker: {
    pointColor:   'rgba(255,220,40,0.9)',
    lineColor:    'rgba(255,255,255,1)',
    lineDash:     [5, 4],
    depthLabelBg: 'rgba(10,10,10,0.72)',
  },
})
