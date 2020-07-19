import ImageLayer from 'ol/layer/Image';
import SourceWMS from 'ol/source/ImageWMS';

export default (startCoord: number[], destCoord: number[]): ImageLayer => {
  const viewparams = [
    `x1:${startCoord[0]}`, `y1:${startCoord[1]}`,
    `x2:${destCoord[0]}`, `y2:${destCoord[1]}`,
  ];

  const layer = new ImageLayer({
    source: new SourceWMS({
      url: 'http://localhost/geoserver/geo/wms',
      params: {
        LAYERS: 'geo:pgrouting',
        FORMAT: 'image/png',
        VIEWPARAMS: viewparams.join(';'),
      },
    }),
  });

  layer.set('name', 'PGROUTING');
  layer.setVisible(false);

  return layer;
};
