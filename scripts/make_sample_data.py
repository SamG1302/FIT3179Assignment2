"""
Generates SAMPLE (synthetic) CSVs so every map renders before your real data is in.
These numbers are NOT real measurements. Replace each data/sample_*.csv with your
cleaned data (same column names) and delete this script when you're done.

Run from the repo root:  python3 scripts/make_sample_data.py
"""
import csv, json, math, random

random.seed(3179)

# ---- 1. Country x decade warming (for the choropleth) ------------------------
# Columns: country, decade, anomaly_c
# 'country' must match the topojson's properties.name exactly (see README).
topo = json.load(open("data/countries-110m.json"))
names = sorted(g["properties"]["name"] for g in topo["objects"]["countries"]["geometries"])

with open("data/sample_country_decade.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["country", "decade", "anomaly_c"])
    for n in names:
        bias = random.uniform(-0.3, 0.6)
        for decade in range(1950, 2030, 10):
            t = (decade - 1950) / 70
            val = bias * t + 1.6 * t ** 2 + random.uniform(-0.2, 0.2)
            w.writerow([n, decade, round(val, 2)])

# ---- 2. City warming (for the proportional symbol map) -----------------------
# Columns: city, country, lat, lon, warming_c
cities = [
    ("Melbourne", "Australia", -37.81, 144.96), ("Sydney", "Australia", -33.87, 151.21),
    ("Perth", "Australia", -31.95, 115.86), ("Darwin", "Australia", -12.46, 130.84),
    ("Alice Springs", "Australia", -23.70, 133.88), ("Hobart", "Australia", -42.88, 147.33),
    ("Kuala Lumpur", "Malaysia", 3.14, 101.69), ("Jakarta", "Indonesia", -6.21, 106.85),
    ("Singapore", "Singapore", 1.35, 103.82), ("Tokyo", "Japan", 35.68, 139.69),
    ("Beijing", "China", 39.90, 116.40), ("Delhi", "India", 28.61, 77.21),
    ("Dubai", "United Arab Emirates", 25.20, 55.27), ("Cairo", "Egypt", 30.04, 31.24),
    ("Lagos", "Nigeria", 6.52, 3.38), ("Nairobi", "Kenya", -1.29, 36.82),
    ("Cape Town", "South Africa", -33.92, 18.42), ("London", "United Kingdom", 51.51, -0.13),
    ("Moscow", "Russia", 55.76, 37.62), ("Reykjavik", "Iceland", 64.15, -21.94),
    ("New York", "United States", 40.71, -74.01), ("Anchorage", "United States", 61.22, -149.90),
    ("Mexico City", "Mexico", 19.43, -99.13), ("São Paulo", "Brazil", -23.55, -46.63),
    ("Buenos Aires", "Argentina", -34.60, -58.38), ("Auckland", "New Zealand", -36.85, 174.76),
]
with open("data/sample_cities.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["city", "country", "lat", "lon", "warming_c"])
    for c, k, lat, lon in cities:
        val = 0.8 + 0.018 * abs(lat) + random.uniform(-0.25, 0.35)
        w.writerow([c, k, lat, lon, round(val, 2)])

# ---- 3. 10-degree grid (for the bin map) -------------------------------------
# Columns: lat, lon, anomaly_c   (lat/lon = centre of each 10x10 degree cell)
with open("data/sample_grid_10deg.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["lat", "lon", "anomaly_c"])
    for lat in range(-55, 90, 10):
        for lon in range(-175, 180, 10):
            val = 0.6 + 1.6 * (max(lat, 0) / 85) ** 2 + random.uniform(-0.3, 0.3)
            w.writerow([lat, lon, round(val, 2)])

print("Sample data written to data/sample_*.csv")
