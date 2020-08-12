import ImageLayer from 'ol/layer/Image';
import SourceWMS from 'ol/source/ImageWMS';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import RenderFeature from 'ol/render/Feature';
import FeatureLike from 'ol/Feature';

import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import CircleStyle from 'ol/style/Circle';

import mapProjection from '../mapProjection';
import { getLabelText } from '../layerLabel';
import { RouteDataTypes, RoutingTypes } from '../../../types';

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

export const routingResultLayerWMS = (startCoord: number[], destCoord: number[]): ImageLayer => {
  const viewparams = [
    `x1:${startCoord[0]}`, `y1:${startCoord[1]}`,
    `x2:${destCoord[0]}`, `y2:${destCoord[1]}`,
  ];

  const layer = new ImageLayer({
    source: new SourceWMS({
      url: 'http://localhost/geoserver/geo/wms',
      params: {
        LAYERS: 'geo:pgrouting_digiroad_digiroad',
        FORMAT: 'image/png',
        VIEWPARAMS: viewparams.join(';'),
      },
    }),
  });

  layer.set('name', 'routing_result');

  return layer;
};

const dijkstraStyle = (feature: RenderFeature | FeatureLike) => (new Style({
  stroke: new Stroke({
    color: 'darkmagenta',
    width: 3,
  }),
  text: getLabelText(feature, 'total_cost_in_min'),
}));

const kspStyle = (feature: RenderFeature | FeatureLike) => {
  const pathId = feature.get('path_id');

  let lineColor = 'black';
  let lineDashOffset = 0;

  switch (pathId) {
    case 1:
      lineColor = 'green';
      lineDashOffset = 0;
      break;
    case 2:
      lineColor = 'orange';
      lineDashOffset = 5;
      break;
    case 3:
      lineColor = 'yellow';
      lineDashOffset = 10;
      break;
    default:
      lineColor = 'black';
      break;
  }

  return new Style({
    stroke: new Stroke({
      color: lineColor,
      lineDash: [10, 20],
      lineDashOffset,
      width: 3,
    }),
    text: getLabelText(feature, 'total_cost_in_min'),
  });
};

export const routingResultLayerWFS = (
  startCoord: number[],
  destCoord: number[],
  routeData: RouteDataTypes,
  routingType: RoutingTypes,
): VectorLayer => {
  const viewparams = [
    `x1:${startCoord[0]}`, `y1:${startCoord[1]}`,
    `x2:${destCoord[0]}`, `y2:${destCoord[1]}`,
  ];

  const layer = new VectorLayer({
    declutter: true,
    extent: mapProjection.getExtent(),
    zIndex: 2,
    minZoom: 0,
    maxZoom: 15,
    source: new VectorSource({
      url: 'http://localhost/geoserver/geo/wfs'
        + `?service=wfs&version=2.0.0&request=GetFeature&typeNames=geo:pgrouting_${routeData}_${routingType}`
        + `&outputFormat=application/json&viewparams=${viewparams.join(';')}`,
      format: new GeoJSON(),
    }),
    style: (feature) => (routingType === 'dijkstra'
      ? dijkstraStyle(feature)
      : kspStyle(feature)),
  });

  layer.set('name', 'routing_result');

  return layer;
};
