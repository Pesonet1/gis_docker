import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

import mapProjection from '../mapProjection';

export default (layerType: string, layerName: string): TileLayer => {
  const layer = new TileLayer({
    opacity: 0.8,
    minZoom: 0,
    maxZoom: 15,
    extent: mapProjection.getExtent(),
    source: new TileWMS({
      url: 'http://localhost/geoserver/geo/wms',
      params: {
        LAYERS: layerType,
        FORMAT: 'image/png8',
        TILED: true,
      },
      serverType: 'geoserver',
      transition: 0,
      projection: mapProjection,
    }),
  });

  layer.set('name', layerName);
  layer.setVisible(false);

  return layer;
};
