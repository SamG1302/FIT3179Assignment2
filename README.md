# A Warming World: FIT3179 Assignment 2

How global average temperatures have changed over the past century, and whether warming is speeding up.
Built with [Vega-Lite](https://vega.github.io/vega-lite/) and [Pure.css](https://purecss.io/), and hosted on GitHub Pages.

## Folder structure

```
index.html            the page: text, layout and an empty <div> for each chart
css/styles.css        all styling (colours and fonts are variables at the top)
js/main.js            embeds each chart and holds the shared chart theme
specs/                one Vega-Lite JSON spec per chart or map
data/                 CSV data plus topojson map boundaries
scripts/              helper scripts (sample-data generator; delete when done)
```

## Charts

| Div id | Spec | Idiom | Data |
|---|---|---|---|
| `vis-global-trend` | `line_global_trend.json` | Line chart + 10-yr rolling mean | `global_annual_anomaly.csv` (`year, temp`) |
| `vis-decade-rate` | `bar_decade_rate.json` | Bar chart (decade-on-decade change) | same file |
| `vis-map-choropleth` | `map_choropleth_decade.json` | **Map 1: choropleth** with decade slider | `sample_country_decade.csv` (`country, decade, anomaly_c`) |
| `vis-map-cities` | `map_symbols_cities.json` | **Map 2: proportional symbol** | `sample_cities.csv` (`city, country, lat, lon, warming_c`) |
| `vis-map-grid` | `map_bin_grid.json` | **Map 3: bin map** (5° grid, decade slider) | `be_grid_5deg.csv` (`lat, lon, land, d1900 … d2020, recent`). Real Berkeley Earth data, see below |

> `global_annual_anomaly.csv` is a starter copy of `global-temp.csv` from the vega-datasets package.
> Every `sample_*.csv` is **synthetic**. Replace them with your cleaned data.
> `sample_grid_10deg.csv` is no longer used and can be deleted.

### be_grid_5deg.csv (bin map)

Made from Berkeley Earth's `Global_TAVG_Gridded_5deg.nc` (high-resolution global land + ocean, 1850 to 2026-08, file created 14 Sep 2026).
One row per 5° cell (2,592 cells). Columns:

- `lat`, `lon`: the centre of each cell
- `land`: the fraction of the cell that is land (0–1)
- `d1900` … `d2020`: the decade-average anomaly vs 1951–1980 (°C). `d2020` covers 2020–2025 only.
  A value is left blank if fewer than 80% of that decade's months have data.
- `recent`: the 2016–2025 average

The file's `areal_weight` variable is constant, so area-weighted means use cos(latitude) instead.
As a check, the global mean computed from this grid matches NASA GISTEMP (r = 0.994; mean difference since 1950 = 0.01 °C).

## Swapping in your data

1. Save your cleaned CSV in `data/`.
2. In the spec, change `"url"` to the new file and rename fields if your columns differ.
3. **Data paths are relative to `index.html`**, not to the spec. Write `"data/x.csv"`, not `"../data/x.csv"`.
4. For the choropleth, your `country` values must match the topojson names exactly
   (e.g. `United States of America`, `Dem. Rep. Congo`). List the names with:
   `python3 -c "import json;print(sorted(g['properties']['name'] for g in json.load(open('data/countries-110m.json'))['objects']['countries']['geometries']))"`

## Running locally

Open the folder in VS Code, install the **Live Server** extension, then right-click `index.html` and choose **Open with Live Server**.
Opening the file directly (`file://`) blocks data loading, so the charts stay blank.

To edit a spec with a live preview, paste it into the [Vega editor](https://vega.github.io/editor/).
Change the data URLs to full GitHub URLs while you're in the editor.

## Adding a chart

1. Create `specs/my_chart.json`.
2. Add `<div id="vis-my-chart" class="vis-container"></div>` to `index.html`.
3. Add `{ id: "#vis-my-chart", spec: "specs/my_chart.json" }` to `VISUALISATIONS` in `js/main.js`.
