import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

import mapProjection from '../mapProjection';

export default (): TileLayer => {
  const layer = new TileLayer({
    minZoom: 0,
    maxZoom: 15,
    extent: mapProjection.getExtent(),
    source: new TileWMS({
      url: 'http://localhost/geoserver/geo/wms',
      params: {
        LAYERS: 'geo:kunnat',
        FORMAT: 'image/png8',
        TILED: true,
      },
      serverType: 'geoserver',
      transition: 0,
      projection: mapProjection,
    }),
  });

  layer.set('name', 'Kunnat TiledWMS');
  layer.setVisible(false);

  return layer;
};
