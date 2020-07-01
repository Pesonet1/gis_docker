import ImageLayer from 'ol/layer/Image';
import SourceWMS from 'ol/source/ImageWMS';
import mapProjection from '../mapProjection';

export default () => {
  const layer = new ImageLayer({
    extent: mapProjection.getExtent(),
    zIndex: 1,
    opacity: 0.65,
    minZoom: 0,
    maxZoom: 15,
    source: new SourceWMS({
      url: 'http://localhost/geoserver/geo/wms',
      params: {
        LAYERS: 'geo:kunnat_2019',
        TRANSPARENT: true,
        FORMAT: 'image/png8',
        RATIO: 1,
      },
      serverType: 'geoserver',
      projection: mapProjection,
    }),
  });

  layer.set('name', 'Kunnat WMS');
  layer.setVisible(false);

  return layer;
};
