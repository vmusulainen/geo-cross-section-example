import { CrossSection } from 'geo-cross-section'
import type { CrossSectionData, ClickPoint } from 'geo-cross-section'
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
const clickInfo = document.getElementById('click-info') as HTMLElement

function onCrossClick(point: ClickPoint) {
  console.log('Cross-section clicked at:', point);
  const geo = (point.lat != null && point.lon != null)
    ? ` &nbsp;·&nbsp; <span>${point.lat.toFixed(5)}°, ${point.lon.toFixed(5)}°</span>`
    : ''
  clickInfo.innerHTML =
    `Distance: <span>${Math.round(point.distance)} m</span>` +
    ` &nbsp;·&nbsp; Elevation: <span>${point.elevation.toFixed(1)} m</span>` +
    ` &nbsp;·&nbsp; Layer: <span>${point.layerId}</span>` +
    geo
}

new CrossSection(container, data, {
  padding: { top: 16, right: 16, bottom: 36, left: 60 },
  measurementUnit: 'm',
  hatchPatternSize: 64,
  initialPan: { x: 10, y: -20 },
  onClick: onCrossClick,

  axes: {
    axisColor:  '#b4b4b4b3',
    gridColor:  '#7878782e',
    labelColor: '#c8c8c8e6',
  },

  layer: {
    borderColor: '#28282866',
  },

  marker: {
    pointColor:   '#ffdc28e6',
    lineColor:    '#ffffff',
    lineDash:     [5, 4],
    depthLabelBg: '#0a0a0ab8',
  },
})
