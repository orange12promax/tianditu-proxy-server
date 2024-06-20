function generateTileParams() {
  const z = 15;
  const x = 27190;
  const y = 13300;
  const count = 3;
  const minX = x - count;
  const maxX = x + count;
  const minY = y - count;
  const maxY = y + count;
  let list = [];
  for (let i = minX; i <= maxX; i++) {
    for (let j = minY; j <= maxY; j++) {
      list.push({ x: i, y: j });
    }
  }
  list = list.map((item) => ({
    ...item,
    z,
    layer: "vec",
    annotation: "cva",
    format: "webp"
  }));
  return list;
}

module.exports = {
  generateTileParams
};
