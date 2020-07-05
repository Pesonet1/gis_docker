import Map from 'ol/Map';
import View from 'ol/View';

import { MapLayersType } from '@/types';

import mapProjection from './mapProjection';

export default (ref: any, layers: MapLayersType[]): Map => (new Map({ // eslint-disable-line
  target: ref,
  layers,
  view: new View({
    projection: mapProjection,
    center: [400000, 7000000],
    zoom: 3,
    maxZoom: 15,
    minZoom: 2,
    enableRotation: false,
  }),
}));
