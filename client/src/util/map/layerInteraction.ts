import axios from 'axios';

import Map from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import Feature, { FeatureLike } from 'ol/Feature';
import { Draw, Modify, Snap } from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';
import VectorLayer from 'ol/layer/Vector';

import WFS from 'ol/format/WFS';
import GML from 'ol/format/GML';

import store from '../../store';

import { InteractionLayers } from '../../types';

export const addSelectInteraction = (mapInstance: Map) => {
  mapInstance.on('click', (event: MapBrowserEvent) => {
    // @ts-ignore
    mapInstance.getLayers().array_.forEach((layer: InteractionLayers) => {
      if ('changed' in layer) {
        layer.changed();
      }
    });

    store.commit('SET_SELECTED_FEATURE', null);

    mapInstance.forEachFeatureAtPixel(event.pixel, (feature: FeatureLike, layer) => {
      store.commit('SET_SELECTED_FEATURE', feature);

      if ('changed' in layer) {
        layer.changed();
      }
    });
  });
};

const createTransaction = (transactionType: string, layer: VectorLayer, features: Feature[]) => {
  const formatWFS = new WFS();
  // @ts-ignore
  const formatGML = new GML({
    featureNS: 'geo',
    featureType: 'kunnat_2019',
    srsName: 'EPSG:3067',
  });

  let node: Node | null = null;

  switch (transactionType) {
    case 'insert':
      node = formatWFS.writeTransaction(features, [], [], formatGML);
      break;
    case 'update':
      node = formatWFS.writeTransaction([], features, [], formatGML);
      break;
    default:
      break;
  }

  if (!node) return;

  axios({
    method: 'post',
    url: 'http://localhost:8080/geoserver/geo/wfs',
    data: new XMLSerializer().serializeToString(node),
    headers: { 'content-type': 'text/xml' },
  }).then((data) => {
    const result = formatWFS.readTransactionResponse(data);
    layer.getSource().clear();
    console.log(result);
  }).catch((error) => console.error(error));
};

export const addDrawInteraction = (mapInstance: Map, layer: any) => { // eslint-disable-line
  const draw = new Draw({
    features: layer.getSource().getFeatures(),
    type: GeometryType.MULTI_POLYGON,
  });
  mapInstance.addInteraction(draw);

  draw.on('drawend', (evt: any) => {
    const feature: Feature = evt.feature; // eslint-disable-line
    feature.set('geom', feature.getGeometry());

    createTransaction('insert', layer, [feature]);
  });
};

export const addModifyInteraction = (mapInstance: Map, layer: any) => {
  const modify = new Modify({ source: layer.getSource() });
  mapInstance.addInteraction(modify);

  const snap = new Snap({ source: layer.getSource() });
  mapInstance.addInteraction(snap);

  let modifiedFeatures: any[] = []; // eslint-disable-line
  let geometryChangeListener: any; // eslint-disable-line

  modify.on('modifystart', (event) => {
    modifiedFeatures = [];

    event.features.forEach((feature: Feature) => {
      geometryChangeListener = feature.getGeometry().on('change', () => {
        if (modifiedFeatures.indexOf(feature) === -1) {
          modifiedFeatures.push(feature);
        }
      });
    });
  });

  modify.on('modifyend', () => {
    if (geometryChangeListener) {
      geometryChangeListener = null;
    }

    const features: any = modifiedFeatures; // eslint-disable-line

    features.forEach((feat: Feature) => {
      feat.setGeometryName('geom');
    });

    createTransaction('update', layer, features);
  });
};
