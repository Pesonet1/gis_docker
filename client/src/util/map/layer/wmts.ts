import TileLayer from 'ol/layer/Tile';
import SourceWMTS from 'ol/source/WMTS';
import TileGridWMTS from 'ol/tilegrid/WMTS';
import * as Extent from 'ol/extent';

import projection from '../projection';

const projectionExtent: [number, number, number, number] = projection.getExtent();
const matrixIds: string[] = new Array(16).fill(0).map((value, index) => index.toString());

export default () => {
  const layer = new TileLayer({
    minZoom: 0,
    maxZoom: 15,
    source: new SourceWMTS({
      url: 'http://localhost/mapproxy/service?',
      layer: 'Taustakartta',
      format: 'image/png',
      matrixSet: 'JHS180',
      style: 'default',
      tileGrid: new TileGridWMTS({
        origin: Extent.getTopLeft(projectionExtent),
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
        matrixIds,
        extent: projectionExtent,
      }),
      projection,
      transition: 0,
    }),
  });

  layer.set('name', 'Taustakartta');

  return layer;
};
