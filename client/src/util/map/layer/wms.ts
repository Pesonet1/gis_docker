import ImageLayer from 'ol/layer/Image';
import SourceWMS from 'ol/source/ImageWMS';

import mapProjection from '../mapProjection';

export default (layerType: string, layerName: string): ImageLayer => {
  const layer = new ImageLayer({
    extent: mapProjection.getExtent(),
    zIndex: 1,
    opacity: 0.7,
    minZoom: 0,
    maxZoom: 15,
    source: new SourceWMS({
      url: 'http://localhost/geoserver/geo/wms',
      params: {
        LAYERS: layerType,
        TRANSPARENT: true,
        FORMAT: 'image/png8',
        RATIO: 1,
      },
      serverType: 'geoserver',
      projection: mapProjection,
    }),
  });

  layer.set('name', layerName);
  layer.setVisible(false);

  return layer;
};
