import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';
import * as Extent from 'ol/extent';
import MVT from 'ol/format/MVT';
import Feature from 'ol/Feature';

import mapProjection from '../mapProjection';
import { defaultStyle } from '../layerStyle';

export default (): VectorTileLayer => {
  const layer = new VectorTileLayer({
    declutter: true,
    renderMode: 'vector',
    source: new VectorTileSource({
      tileGrid: new TileGrid({
        origin: Extent.getTopLeft(mapProjection.getExtent()),
        extent: mapProjection.getExtent(),
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
        tileSize: [256, 256],
      }),
      minZoom: 6,
      maxZoom: 15,
      format: new MVT({
        // @ts-ignore
        featureClass: Feature,
        geometryName: 'geom',
      }),
      url: 'http://localhost/geoserver/geo/gwc/service/tms/1.0.0/'
        + 'geo:kunnat'
        + '@JHS180'
        + '@pbf/{z}/{x}/{-y}.pbf',
      projection: mapProjection,
    }),
    style: defaultStyle(),
  });

  layer.set('name', 'Kunnat VectorTile');
  layer.setVisible(false);

  return layer;
};
