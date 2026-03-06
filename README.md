# geo-cross-section-example

Example application demonstrating the [geo-cross-section](https://github.com/vmusulainen/geo-cross-section) library — a zero-dependency TypeScript/Canvas 2D renderer for interactive geological cross-sections in web browsers.

![Screenshot](./screenshot.png)

## What's in the demo

- **30 real geological layers** spanning ~1 007 m of transect depth
- **PNG hatch overlay patterns** generated per geological unit type (sand, clay, limestone, moraine, etc.)
- **4 reference lines** with geographic coordinates — click anywhere to see interpolated lat/lon
- **Measurement marker** — left-click places a depth badge showing distance to upper and lower layer boundaries; right-click removes it
- **Zoom & pan** — scroll wheel to zoom (capped at original scale), drag to pan
- **Hover tooltip** — shows layer name and cursor coordinates

## Getting started

```bash
git clone https://github.com/vmusulainen/geo-cross-section-example.git
cd geo-cross-section-example
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Scripts

| Command                  | Description                                      |
|--------------------------|--------------------------------------------------|
| `npm run dev`            | Start Vite dev server                            |
| `npm run build`          | Production build to `dist/`                      |
| `npm run preview`        | Preview the production build locally             |
| `npm run generate:hatches` | Regenerate hatch PNG tiles in `public/hatches/` |

## Regenerating hatch tiles

Hatch PNGs are generated programmatically (no proprietary assets) using the `canvas` package:

```bash
npm run generate:hatches
```

The script (`scripts/generate-hatches.mjs`) produces 30 unique 64×64 px tiles covering geological pattern families: crosshatch, sand dots, brick (limestone), wavy lines, moraine circles, glacial till, and more.

## License

MIT
