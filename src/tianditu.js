function getTiandituUrl(options) {
  const { layer, tileMatrixSet, tk, z, y, x } = options;
  const url = `t0.tianditu.gov.cn/${layer}_${tileMatrixSet}/wmts`;
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
    tk,
  };
  const searchParams = new URLSearchParams(params);
  return `http://${url}?${searchParams.toString()}`;
}

module.exports = {
  getTiandituUrl,
};
