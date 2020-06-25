import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

import SourceWMTS from 'ol/source/WMTS';
import SourceWMS from 'ol/source/ImageWMS';
import VectorTileSource from 'ol/source/VectorTile';
import SourceVector from 'ol/source/Vector';

import TileGridWMTS from 'ol/tilegrid/WMTS';
import TileGrid from 'ol/tilegrid/TileGrid';
import * as Extent from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';
import MVT from 'ol/format/MVT';

import Feature from 'ol/Feature';

import { bbox as bboxStrategy } from 'ol/loadingstrategy';

import projection from './projection';
import getLabel from './layerLabel';
import { defaultStyle, selectionStyle } from './layerStyle';

import store from '../../store';

const projectionExtent: [number, number, number, number] = projection.getExtent();
const matrixIds: string[] = new Array(16).fill(0).map((value, index) => index.toString());

export const backgroundLayer = () => {
  const layer = new TileLayer({
    // opacity: 0.65,
    minZoom: 0,
    maxZoom: 15,
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
  });

  layer.set('name', 'Taustakartta');

  return layer;
};

export const kunnatWMS = () => {
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

export const kunnatWFS = () => {
  const layer = new VectorLayer({
    extent: projectionExtent,
    zIndex: 2,
    minZoom: 0,
    maxZoom: 15,
    source: new SourceVector({
      format: new GeoJSON(),
      url: (extent) => ('http://localhost/geoserver/geo/wfs'
        + '?service=wfs&version=2.0.0&request=GetFeature&typeNames=geo:kunnat_2019'
        + '&outputFormat=application/json'
        + `&bbox=${extent.join(',')}`
      ),
      strategy: bboxStrategy,
    }),
    style: (feature) => { // eslint-disable-line
      if (!store.state.selectedFeature) return getLabel(feature); // eslint-disable-line
      if (!store.state.selectedFeature.hasOwnProperty('id_')) return getLabel(feature); // eslint-disable-line
      if (feature.id_ === store.state.selectedFeature.id_) { // eslint-disable-line
        return selectionStyle(feature);
      }

      return getLabel(feature);
    },
  });

  layer.set('name', 'Kunnat WFS');
  layer.setVisible(false);

  return layer;
};

export const kunnatVectorTile = () => {
  const layer = new VectorTileLayer({
    declutter: true,
    renderMode: 'vector',
    source: new VectorTileSource({
      tileGrid: new TileGrid({
        origin: Extent.getTopLeft(projectionExtent),
        extent: projection.getExtent(),
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
        tileSize: [256, 256],
      }),
      minZoom: 0,
      maxZoom: 15,
      format: new MVT({
        featureClass: Feature, // eslint-disable-line
      }),
      url: 'http://localhost:8080/geoserver/geo/gwc/service/tms/1.0.0/'
        + 'geo:kunnat_2019'
        + '@JHS180'
        + '@pbf/{z}/{x}/{-y}.pbf',
      projection,
    }),
    style: (feature) => { // eslint-disable-line
      if (!store.state.selectedFeature) return defaultStyle(); // eslint-disable-line
      if (!store.state.selectedFeature.hasOwnProperty('id_')) return defaultStyle(); // eslint-disable-line
      if (feature.id_ === store.state.selectedFeature.id_) { // eslint-disable-line
        return selectionStyle(feature);
      }

      return defaultStyle();
    },
  });

  layer.set('name', 'Kunnat VectorTile');
  layer.setVisible(false);

  return layer;
};
