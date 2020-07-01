import ImageLayer from 'ol/layer/Image';
import SourceWMS from 'ol/source/ImageWMS';
import projection from '../projection';

const projectionExtent: [number, number, number, number] = projection.getExtent();

export default () => {
  const layer = new ImageLayer({
    extent: projectionExtent,
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
      projection,
    }),
  });

  layer.set('name', 'Kunnat WMS');
  layer.setVisible(false);

  return layer;
};
