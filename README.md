# A Warming World: FIT3179 Assignment 2

How global average temperatures have changed over the past century, and whether warming is speeding up.
Built with [Vega-Lite](https://vega.github.io/vega-lite/) and [Pure.css](https://purecss.io/), and hosted on GitHub Pages.

## Folder structure

```
index.html            the page: text, layout and an empty <div> for each chart
css/styles.css        all styling (colours and fonts are variables at the top)
js/main.js            embeds each chart and holds the shared chart theme
specs/                one Vega-Lite JSON spec per chart or map
data/                 chart-ready data (about 1.4 MB in total)
```

## Charts and data

| Div id | Spec | Idiom | Data |
|---|---|---|---|
| `vis-global-trend` | `line_global_trend.json` | Line chart + trailing 10-yr mean | `gistemp_global.csv` |
| `vis-decade-rate` | `bar_decade_rate.json` | Bar chart (decade-on-decade change) | `gistemp_global.csv` |
| `vis-map-choropleth` | `map_choropleth_year.json` | **Map 1: choropleth**, year slider 1940–2025 | `owid_annual_countries.csv` + `ne_110m_countries.topojson` |
| `vis-map-symbols` | `map_symbols_countries.json` | **Map 2: proportional symbol**, legend filter | `owid_country_summary.csv` + `country_points.csv` |
| `vis-map-grid` | `map_bin_grid.json` | **Map 3: bin map** (5° grid), decade slider | `be_grid_decades.csv` + `be_grid_cells.geojson` |

### Where each data file comes from

Most files are produced by `prep_data.R`, which lives outside this repo with the raw downloads (`Datasets/`).
It writes them to `Datasets/clean/`, from where they're copied into `data/`.

| File | Source | Baseline |
|---|---|---|
| `gistemp_global.csv` | NASA GISTEMP v4 `GLB.Ts+dSST.csv`, 1880–2026 (2026 incomplete, filtered out in the specs) | 1951–1980 |
| `owid_annual_countries.csv` | Our World in Data annual anomalies (Copernicus ERA5), 1940–2025. `map_id` = Natural Earth `ADM0_A3` | 1991–2020 as supplied; **re-baselined to 1951–1980 in the choropleth spec** |
| `owid_country_summary.csv` | Same source, one row per country: change 1951–1980 → 1996–2025, warming rate 1950–1979 vs 1980–2025 | Changes and rates, so the baseline doesn't matter |
| `be_grid_cells.geojson` | Berkeley Earth 5° gridded TAVG (land + ocean), one clockwise square per cell, with `id` | – |
| `be_grid_decades.csv` | Same grid: decade-average anomaly per cell (`id, decade, anomaly`). A decade needs ≥ 5 complete years | 1951–1980 |
| `ne_110m_countries.topojson` | Natural Earth 1:110m Admin 0 – Countries, converted with mapshaper (`-filter-fields ADM0_A3,NAME`) | – |
| `country_points.csv` | Made from the TopoJSON with mapshaper: `-points inner -each 'lon=+this.x.toFixed(2), lat=+this.y.toFixed(2)' -rename-fields map_id=ADM0_A3 -o format=csv` | – |
| `land-110m.json` | world-atlas 2.0.2 (Natural Earth land, 1:110m), used for coastlines | – |

Joins: the OWID files join to the map on `map_id` = `properties.ADM0_A3`, and the grid joins on `id` = `properties.id`.

## Running locally

Open the folder in VS Code, install the **Live Server** extension, then right-click `index.html` and choose **Open with Live Server**.
Opening the file directly (`file://`) blocks data loading, so the charts stay blank.

**Data paths in specs are relative to `index.html`**, not to the spec. Write `"data/x.csv"`, not `"../data/x.csv"`.

## Updating the data

1. Re-run `prep_data.R` in `Datasets/` (47 checks should pass).
2. Copy the files listed above from `Datasets/clean/` into `data/`.
3. Commit and push.

## Adding a chart

1. Create `specs/my_chart.json`.
2. Add `<div id="vis-my-chart" class="vis-container"></div>` to `index.html`.
3. Add `{ id: "#vis-my-chart", spec: "specs/my_chart.json" }` to `VISUALISATIONS` in `js/main.js`.
