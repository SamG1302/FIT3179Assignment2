// ============================================================================
// main.js: embeds every Vega-Lite chart on the page.
//
// To add a chart:
//   1. Create a spec in specs/ (e.g. specs/my_chart.json)
//   2. Add <div id="vis-my-chart" class="vis-container"></div> to index.html
//   3. Add a line to the VISUALISATIONS list below
//
// NOTE: data "url"s inside a spec are relative to index.html, NOT to the spec
// file, so write "data/my_file.csv" and not "../data/my_file.csv".
// ============================================================================

const VISUALISATIONS = [
  // Part 1: the long view
  { id: "#vis-global-trend",   spec: "specs/line_heatmap_global.json" },
  // Part 2: is warming speeding up?
  { id: "#vis-decade-rate",    spec: "specs/lollipop_decade_rate.json" },
  { id: "#vis-hottest-years",  spec: "specs/bump_hottest_years.json" },
  // Part 3: where is it warming?
  { id: "#vis-map-choropleth", spec: "specs/map_choropleth_year.json" },
  { id: "#vis-map-grid",       spec: "specs/map_bin_grid.json" },
  // Part 4: country by country
  { id: "#vis-map-symbols",    spec: "specs/map_symbols_countries.json" },
  { id: "#vis-jitter",         spec: "specs/jitter_country_decades.json" },
  { id: "#vis-dumbbell",       spec: "specs/dumbbell_country_rates.json" },
  // Part 5: Australia's seasons
  { id: "#vis-slope",          spec: "specs/slope_au_seasons.json" },
  { id: "#vis-radial",         spec: "specs/radial_au_months.json" },
  // Part 6: days and nights
  { id: "#vis-butterfly",      spec: "specs/butterfly_days_nights.json" }
];

// Shared look for every chart, so styling is consistent and lives in one place.
// A "config" block inside a single spec overrides these values for that chart.
const THEME = {
  background: null,                       // transparent: the page colour shows through
  font: "Inter, system-ui, sans-serif",
  view: { stroke: null },                 // no box around plots (data-ink ratio)
  axis: {
    labelColor: "#5c6370",
    titleColor: "#5c6370",
    labelFontSize: 11,
    titleFontSize: 12,
    titleFontWeight: 500,
    gridColor: "#e6e4df",
    domainColor: "#b9b6af",
    tickColor: "#b9b6af"
  },
  legend: {
    labelColor: "#5c6370",
    titleColor: "#1f2328",
    labelFontSize: 11,
    titleFontSize: 12,
    titleFontWeight: 600
  },
  title: {
    font: "'Source Serif 4', Georgia, serif",
    fontSize: 16,
    fontWeight: 600,
    color: "#1f2328",
    subtitleColor: "#5c6370",
    subtitleFontSize: 12,
    anchor: "start",
    offset: 12
  }
};

// "no-cache" makes the browser check GitHub Pages for a newer copy of each
// spec and data file (it still re-uses its copy if nothing changed), so an
// update never shows old charts next to the new page.
const EMBED_OPTIONS = {
  actions: false,
  config: THEME,
  loader: vega.loader({ http: { cache: "no-cache" } })
};

// ----------------------------------------------------------------------------
// Responsive widths for multi-view specs.
// Vega-Lite's "width": "container" only works for single and layered charts,
// not for vconcat/hconcat. Specs that need it carry a "usermeta.responsive"
// block; here we set their panel widths from the container's width and
// re-draw them when the window is resized.
// ----------------------------------------------------------------------------
function fitToWidth(spec, containerWidth) {
  const r = spec.usermeta && spec.usermeta.responsive;
  if (!r) return spec;
  const s = JSON.parse(JSON.stringify(spec));          // never mutate the original
  const usable = Math.max(240, containerWidth - (r.reserve || 0));
  if (r.layout === "vconcat") {
    s.vconcat.forEach((view) => { view.width = usable; });
  } else if (r.layout === "butterfly") {
    const side = Math.max(100, Math.floor((usable - (r.middle || 60)) / 2));
    s.hconcat[0].width = side;
    s.hconcat[2].width = side;
  }
  return s;
}

function showError(id, specUrl, err) {
  console.error(`Failed to load ${specUrl}:`, err);
  const el = document.querySelector(id);
  if (el) {
    el.innerHTML =
      `<p class="vis-error">Could not load <code>${specUrl}</code>: ${err.message}.<br>` +
      `If you opened index.html directly, use VS Code's Live Server instead.</p>`;
  }
}

async function embed({ id, spec: specUrl }) {
  const el = document.querySelector(id);
  if (!el) return;
  try {
    const spec = await (await fetch(specUrl, { cache: "no-cache" })).json();
    if (!(spec.usermeta && spec.usermeta.responsive)) {
      await vegaEmbed(id, spec, EMBED_OPTIONS);          // single/layered: "container" handles width
      return;
    }
    let lastWidth = 0;
    let view = null;
    const draw = async () => {
      const w = el.clientWidth;
      if (!w || Math.abs(w - lastWidth) < 20) return;    // ignore tiny changes
      lastWidth = w;
      if (view) view.finalize();
      view = (await vegaEmbed(id, fitToWidth(spec, w), EMBED_OPTIONS)).view;
    };
    await draw();
    let timer = null;
    window.addEventListener("resize", () => {
      clearTimeout(timer);
      timer = setTimeout(draw, 200);
    });
  } catch (err) {
    showError(id, specUrl, err);
  }
}

VISUALISATIONS.forEach(embed);
