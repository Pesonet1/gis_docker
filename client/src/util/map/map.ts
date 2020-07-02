import Map from 'ol/Map';
import View from 'ol/View';

import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';

import mapProjection from './mapProjection';

export default (
  ref: HTMLElement,
  layers: (TileLayer | VectorLayer | ImageLayer)[],
): Map => (new Map({
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
