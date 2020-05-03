import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import SourceWMTS from 'ol/source/WMTS';
import SourceWMS from 'ol/source/ImageWMS';
import SourceVector from 'ol/source/Vector';
import TileGridWMTS from 'ol/tilegrid/WMTS';
import * as Extent from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';

import { bbox as bboxStrategy } from 'ol/loadingstrategy';

import projection from './projection';
import getLabel from './layerLabel';

const projectionExtent: [number, number, number, number] = projection.getExtent();
const matrixIds: string[] = new Array(16).fill(0).map((value, index) => index.toString());

export const wmts = () => (new TileLayer({
  // opacity: 0.65,
  source: new SourceWMTS({
    url: 'http://localhost/mapproxy/service?',
    layer: 'Taustakartta',
    format: 'image/png',
    matrixSet: 'JHS180',
    style: 'default',
    tileGrid: new TileGridWMTS({
      origin: Extent.getTopLeft(projectionExtent),
      resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
      matrixIds,
      extent: projectionExtent,
    }),
    projection,
    transition: 0,
  }),
}));

export const wms = () => (new ImageLayer({
  extent: projectionExtent,
  zIndex: 1,
  opacity: 0.65,
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
}));

export const wfs = () => (new VectorLayer({
  extent: projectionExtent,
  zIndex: 2,
  minZoom: 6,
  source: new SourceVector({
    format: new GeoJSON(),
    url: (extent) => ('http://localhost/geoserver/geo/wfs'
      + '?service=wfs&version=2.0.0&request=GetFeature&typeNames=geo:kunnat_2019'
      + '&outputFormat=application/json'
      + `&bbox=${extent.join(',')}`
    ),
    strategy: bboxStrategy,
  }),
  style: getLabel,
}));
