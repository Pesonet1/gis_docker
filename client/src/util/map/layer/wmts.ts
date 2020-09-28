import TileLayer from 'ol/layer/Tile';
import SourceWMTS from 'ol/source/WMTS';
import TileGridWMTS from 'ol/tilegrid/WMTS';
import * as Extent from 'ol/extent';

import { MAPPROXY_URL } from '@/apiConfig';

import mapProjection from '../mapProjection';

const matrixIds: string[] = new Array(16).fill(0).map((value, index) => index.toString());

export default (): TileLayer => {
  const layer = new TileLayer({
    minZoom: 0,
    maxZoom: 15,
    extent: mapProjection.getExtent(),
    source: new SourceWMTS({
      url: `${MAPPROXY_URL}/service?`,
      layer: 'Taustakartta',
      format: 'image/png',
      matrixSet: 'JHS180',
      style: 'default',
      tileGrid: new TileGridWMTS({
        origin: Extent.getTopLeft(mapProjection.getExtent()),
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
        matrixIds,
        extent: mapProjection.getExtent(),
      }),
      projection: mapProjection,
      transition: 0,
    }),
  });

  layer.set('name', 'Taustakartta WMTS');

  return layer;
};
