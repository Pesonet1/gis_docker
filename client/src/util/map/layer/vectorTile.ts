import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';
import * as Extent from 'ol/extent';
import MVT from 'ol/format/MVT';
import Feature from 'ol/Feature';

import projection from '../projection';
import { defaultStyle } from '../layerStyle';

const projectionExtent: [number, number, number, number] = projection.getExtent();

export default () => {
  const layer = new VectorTileLayer({
    declutter: true,
    renderMode: 'vector',
    source: new VectorTileSource({
      tileGrid: new TileGrid({
        origin: Extent.getTopLeft(projectionExtent),
        extent: projection.getExtent(),
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
        tileSize: [256, 256],
      }),
      minZoom: 6,
      maxZoom: 15,
      format: new MVT({
        // @ts-ignore
        featureClass: Feature,
      }),
      url: 'http://localhost:8080/geoserver/geo/gwc/service/tms/1.0.0/'
        + 'geo:kunnat_2019'
        + '@JHS180'
        + '@pbf/{z}/{x}/{-y}.pbf',
      projection,
    }),
    style: defaultStyle(),
  });

  layer.set('name', 'Kunnat VectorTile');
  layer.setVisible(false);

  return layer;
};
