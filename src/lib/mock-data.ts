export type Hazard = "Critical" | "High" | "Medium" | "Low";

export type Detection = {
  id: string;
  label: string;
  confidence: number;
  hazard: Hazard;
  dimensions: string;
  lat: number;
  lon: number;
  depth: string;
  acousticShadow: "Strong" | "Moderate" | "Weak" | "None";
  status: "Verified" | "Pending review" | "Filtered";
  action: string;
  filtered?: boolean;
  /** bounding box in % of the sonar frame */
  box: { x: number; y: number; w: number; h: number };
  notes: string;
};

export const detections: Detection[] = [
  {
    id: "ANM-2201",
    label: "Shipwreck",
    confidence: 97,
    hazard: "High",
    dimensions: "42.6 m × 9.1 m × 4.8 m",
    lat: 15.4218,
    lon: 73.7841,
    depth: "38.4 m",
    acousticShadow: "Strong",
    status: "Verified",
    action: "Flag as navigational hazard and notify hydrographic office for chart update.",
    box: { x: 12, y: 25, w: 26, h: 28 },
    notes:
      "Elongated high-reflectivity target with continuous acoustic shadow consistent with an intact steel hull resting on port side.",
  },
  {
    id: "ANM-2202",
    label: "Ghost Net",
    confidence: 94,
    hazard: "Critical",
    dimensions: "18.2 m × 12.7 m",
    lat: 15.4396,
    lon: 73.8012,
    depth: "26.1 m",
    acousticShadow: "Moderate",
    status: "Verified",
    action: "Priority retrieval — schedule diver-assisted removal within 14 days.",
    box: { x: 60, y: 15, w: 22, h: 22 },
    notes:
      "Diffuse mesh-like scattering signature with irregular edges; classic derelict fishing gear entanglement over rocky substrate.",
  },
  {
    id: "ANM-2203",
    label: "Pipe",
    confidence: 88,
    hazard: "Medium",
    dimensions: "76.4 m × 0.9 m",
    lat: 15.4281,
    lon: 73.8134,
    depth: "31.7 m",
    acousticShadow: "Weak",
    status: "Pending review",
    action: "Cross-reference against submarine utility corridor registry.",
    box: { x: 66, y: 42, w: 8, h: 46 },
    notes:
      "Linear man-made feature with uniform width and partial burial; likely abandoned outfall or utility conduit segment.",
  },
  {
    id: "ANM-2204",
    label: "Cylinder",
    confidence: 84,
    hazard: "High",
    dimensions: "2.1 m × 1.1 m",
    lat: 15.4172,
    lon: 73.8267,
    depth: "29.3 m",
    acousticShadow: "Strong",
    status: "Pending review",
    action: "Treat as unidentified container — restrict trawling within 200 m radius.",
    box: { x: 73, y: 60, w: 9, h: 10 },
    notes:
      "Compact cylindrical return with crisp leading edge and pronounced shadow; drum or pressure vessel morphology.",
  },
  {
    id: "ANM-2205",
    label: "Natural Formation",
    confidence: 41,
    hazard: "Low",
    dimensions: "9.4 m × 6.8 m",
    lat: 15.4442,
    lon: 73.7735,
    depth: "34.0 m",
    acousticShadow: "None",
    status: "Filtered",
    action: "No action — suppressed by geomorphology filter.",
    filtered: true,
    box: { x: 38, y: 70, w: 14, h: 14 },
    notes:
      "Low-contrast rippled texture matching surrounding sand-wave field; rejected by man-made-object classifier threshold.",
  },
];

export const activeDetections = detections.filter((d) => !d.filtered);

export const hazardTone: Record<Hazard, string> = {
  Critical: "text-hazard-critical",
  High: "text-hazard-high",
  Medium: "text-hazard-medium",
  Low: "text-hazard-low",
};

export const hazardBg: Record<Hazard, string> = {
  Critical: "bg-hazard-critical/15 text-hazard-critical border-hazard-critical/40",
  High: "bg-hazard-high/15 text-hazard-high border-hazard-high/40",
  Medium: "bg-hazard-medium/15 text-hazard-medium border-hazard-medium/40",
  Low: "bg-hazard-low/15 text-hazard-low border-hazard-low/40",
};

export const scanMeta = {
  id: "SSS-2026-0431",
  vessel: "RV Sagar Anveshika",
  area: "Mormugao Approach Channel, Goa",
  sonar: "EdgeTech 6205 · 600 kHz",
  swath: "150 m",
  date: "04 Sep 2026",
  operator: "Marine Survey Cell / NIOT",
  lineLength: "4.8 km",
  altitude: "2.3 m",
};

export type Scan = {
  id: string;
  date: string;
  area: string;
  anomalies: number;
  status: "Analyzed" | "Under review" | "Processing" | "Archived";
  risk: Hazard;
};

export const scanHistory: Scan[] = [
  { id: "SSS-2026-0431", date: "04 Sep 2026", area: "Mormugao Approach Channel", anomalies: 4, status: "Analyzed", risk: "Critical" },
  { id: "SSS-2026-0428", date: "31 Aug 2026", area: "Gulf of Kutch — Sector 7", anomalies: 6, status: "Under review", risk: "High" },
  { id: "SSS-2026-0419", date: "26 Aug 2026", area: "Chennai Outer Harbour", anomalies: 2, status: "Analyzed", risk: "Medium" },
  { id: "SSS-2026-0410", date: "18 Aug 2026", area: "Andaman Shelf Line A-12", anomalies: 9, status: "Analyzed", risk: "High" },
  { id: "SSS-2026-0402", date: "09 Aug 2026", area: "Kochi Fairway Buoy Zone", anomalies: 3, status: "Archived", risk: "Low" },
  { id: "SSS-2026-0397", date: "02 Aug 2026", area: "Paradip Anchorage", anomalies: 5, status: "Archived", risk: "Medium" },
];

export const dashboardStats = {
  totalAnomalies: 218,
  highRisk: 46,
  ghostNets: 37,
  avgConfidence: 91.4,
  scansProcessed: 64,
  areaSurveyed: "412 km²",
};

export const classDistribution = [
  { name: "Ghost Net", value: 37, fill: "var(--color-chart-1)" },
  { name: "Debris", value: 64, fill: "var(--color-chart-2)" },
  { name: "Pipe/Cable", value: 41, fill: "var(--color-chart-3)" },
  { name: "Wreck", value: 22, fill: "var(--color-chart-4)" },
  { name: "Container", value: 54, fill: "var(--color-chart-5)" },
];

export const monthlyTrend = [
  { month: "Mar", anomalies: 18, highRisk: 4 },
  { month: "Apr", anomalies: 26, highRisk: 6 },
  { month: "May", anomalies: 31, highRisk: 8 },
  { month: "Jun", anomalies: 29, highRisk: 5 },
  { month: "Jul", anomalies: 44, highRisk: 11 },
  { month: "Aug", anomalies: 52, highRisk: 9 },
  { month: "Sep", anomalies: 18, highRisk: 3 },
];

export const pipelineStages = [
  { key: "preprocess", label: "Sonar image preprocessing", detail: "Slant-range correction · TVG normalisation" },
  { key: "denoise", label: "Noise reduction", detail: "Speckle suppression · nadir gap interpolation" },
  { key: "detect", label: "AI object detection", detail: "AquaGuard-YOLOv8n · 1280 px tiling" },
  { key: "classify", label: "Anomaly classification", detail: "Man-made vs. geomorphology discriminator" },
  { key: "confidence", label: "Confidence scoring", detail: "Ensemble calibration · shadow validation" },
  { key: "geotag", label: "Geotagging", detail: "Towfish layback + RTK fix fusion" },
];

export const supportedFormats = ["XTF", "JSF", "SEGY", "GeoTIFF", "PNG", "JPG"];
