import ImageLayer from 'ol/layer/Image';
import SourceWMS from 'ol/source/ImageWMS';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

import RenderFeature from 'ol/render/Feature';
import FeatureLike from 'ol/Feature';

import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import CircleStyle from 'ol/style/Circle';

export const defaultStyle = () => (new Style({
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({
      color: 'black',
    }),
    stroke: new Stroke({
      color: 'black',
      width: 1,
    }),
  }),
}));

export const routingLocationLayer = (): VectorLayer => {
  const layer = new VectorLayer({
    source: new VectorSource(),
    style: (feature: RenderFeature | FeatureLike) => new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: 'red',
        }),
        stroke: new Stroke({
          color: 'black',
          width: 1,
        }),
      }),
      text: new Text({
        font: '11px Verdana',
        fill: new Fill({
          color: 'white',
        }),
        stroke: new Stroke({
          color: 'black',
          width: 3,
        }),
        offsetX: 0,
        offsetY: -15,
        placement: 'top',
        // @ts-ignore
        text: feature.values_.text,
        overflow: true,
        padding: [5, 5, 5, 5],
      }),
    }),
  });

  layer.set('name', 'routing_input');

  return layer;
};

export const routingResultLayer = (startCoord: number[], destCoord: number[]): ImageLayer => {
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

  layer.set('name', 'routing_result');

  return layer;
};
