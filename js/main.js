// ============================================================================
// main.js: embeds every Vega-Lite chart on the page.
//
// To add a chart:
//   1. Create a spec in specs/ (e.g. specs/seasons_heatmap.json)
//   2. Add <div id="vis-seasons" class="vis-container"></div> to index.html
//   3. Add a line to the VISUALISATIONS list below
//
// NOTE: data "url"s inside a spec are relative to index.html, NOT to the spec
// file, so write "data/my_file.csv" and not "../data/my_file.csv".
// ============================================================================

const VISUALISATIONS = [
  { id: "#vis-global-trend",   spec: "specs/line_global_trend.json" },
  { id: "#vis-decade-rate",    spec: "specs/bar_decade_rate.json" },
  { id: "#vis-map-choropleth", spec: "specs/map_choropleth_decade.json" },
  { id: "#vis-map-cities",     spec: "specs/map_symbols_cities.json" },
  { id: "#vis-map-grid",       spec: "specs/map_bin_grid.json" }
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

const EMBED_OPTIONS = { actions: false, config: THEME };

VISUALISATIONS.forEach(({ id, spec }) => {
  vegaEmbed(id, spec, EMBED_OPTIONS).catch((err) => {
    // Show the problem on the page instead of failing silently
    console.error(`Failed to load ${spec}:`, err);
    const el = document.querySelector(id);
    if (el) {
      el.innerHTML =
        `<p class="vis-error">Could not load <code>${spec}</code>: ${err.message}.<br>` +
        `If you opened index.html directly, use VS Code's Live Server instead.</p>`;
    }
  });
});
