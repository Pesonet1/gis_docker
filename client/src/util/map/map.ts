import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import { MapLayersType } from '@/types';

import mapProjection from './mapProjection';

const OSMLayer = (): TileLayer => {
  const layer = new TileLayer({
    source: new OSM(),
  });

  layer.set('name', 'Taustakartta OL/OSM');
  layer.setVisible(false);

  return layer;
};

export default (ref: any, mapLayers: MapLayersType[]): Map => (new Map({ // eslint-disable-line
  target: ref,
  layers: [
    OSMLayer(),
    ...mapLayers,
  ],
  view: new View({
    projection: mapProjection,
    center: [400000, 7000000],
    zoom: 3,
    maxZoom: 15,
    minZoom: 2,
    enableRotation: false,
  }),
}));
