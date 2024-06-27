const { handleBufferThroughMinio, getCacheBuffer } = require("./basic");
const { getNativeBuffer } = require("./native");
const { getAnnotationLayer } = require("../utils/tianditu");
const { mergeImages } = require("../utils/image");

function getMergedLayers(layer) {
  const annotationLayer = getAnnotationLayer(layer);
  if (annotationLayer) {
    return [layer, annotationLayer];
  } else {
    return [];
  }
}

async function getMultiBuffer(multiOptions) {
  let buffers = [];
  for (const options of multiOptions) {
    const buffer = await getNativeBuffer(options);
    if (buffer) {
      buffers.push(buffer);
    } else {
      buffers = null;
      break;
    }
  }
  return buffers;
}

async function mergeLayers(options) {
  const { layer, ...restOptions } = options;
  const layerOptions = layer
    .split("+")
    .map((layerItem) => ({ ...restOptions, layer: layerItem }));
  const buffers = await getMultiBuffer(layerOptions);
  if (buffers) {
    return await mergeImages(buffers);
  } else {
    return null;
  }
}

function getMergedBufferThroughMinio(options) {
  return handleBufferThroughMinio(options, mergeLayers);
}

async function getMergedBuffer(options) {
  const { layer, ...restOptions } = options;
  const layers = getMergedLayers(layer);
  if (layers.length > 0) {
    const newOptions = {
      ...restOptions,
      layer: layers.join("+")
    };
    const cacheBuffer = await getCacheBuffer(newOptions);
    if (cacheBuffer) {
      return cacheBuffer;
    } else {
      const buffer = await getMergedBufferThroughMinio(newOptions);
      return buffer;
    }
  }
}

module.exports = {
  getMergedBuffer
};
