function getTiandituUrl(options) {
  const { layer, tileMatrixSet, tk, z, y, x } = options;
  // t0-t7
  const domainNum = Math.floor(Math.random() * 8);
  const domain = `t${domainNum}.tianditu.gov.cn`;
  const url = `${domain}/${layer}_${tileMatrixSet}/wmts`;
  const params = {
    SERVICE: "WMTS",
    REQUEST: "GetTile",
    VERSION: "1.0.0",
    LAYER: layer,
    STYLE: "default",
    TILEMATRIXSET: tileMatrixSet,
    FORMAT: "tiles",
    TILEMATRIX: z,
    TILEROW: y,
    TILECOL: x,
    tk
  };
  const searchParams = new URLSearchParams(params);
  return `http://${url}?${searchParams.toString()}`;
}

function getFakeHeaders() {
  return {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
  };
}

function getAnnotationLayer(layer) {
  switch (layer) {
    case "vec":
      return "cva";
    case "img":
      return "cia";
    case "ter":
      return "cta";
    default:
      return null;
  }
}

module.exports = {
  getTiandituUrl,
  getFakeHeaders,
  getAnnotationLayer
};
