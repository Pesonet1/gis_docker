import axios from 'axios';

import Map from 'ol/Map';
import Feature from 'ol/Feature';
import {
  Draw,
  Modify,
  Snap,
  Select,
} from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import { ModifyEvent } from 'ol/interaction/Modify';
import { SelectEvent } from 'ol/interaction/Select';
import GeometryType from 'ol/geom/GeometryType';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

import WFS from 'ol/format/WFS';
import GML from 'ol/format/GML';

import { defaultStyle, selectionStyle } from './layerStyle';

import store from '../../store';

import { WFSTransactionType } from '../../types';

export const addSelectInteraction = (mapInstance: Map, layer: VectorLayer | VectorTileLayer) => {
  const selectInteraction = new Select();
  mapInstance.addInteraction(selectInteraction);

  selectInteraction.on('select', (event: SelectEvent) => {
    event.selected.forEach((each) => {
      each.setStyle(selectionStyle());
    });

    event.deselected.forEach((each) => {
      each.setStyle(defaultStyle());
    });

    // Different logic for handling selection for vectorTileLayer
    // TODO Refactor this into own function
    if (layer instanceof VectorTileLayer) {
      if (event.selected.length > 0) {
        store.commit('SET_SELECTED_FEATURE', event.selected[0]);

        if ('changed' in layer) {
          layer.changed();
        }
      }
    }
  });

  return selectInteraction;
};

export const createTransaction = (
  transactionType: WFSTransactionType,
  layer: VectorLayer,
  features: Feature[],
) => {
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
    case 'delete':
      node = formatWFS.writeTransaction([], [], features, formatGML);
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
    console.log(result);
    layer.getSource().refresh();
  }).catch((error) => console.error(error));
};

export const addDrawInteraction = (mapInstance: Map, layer: VectorLayer) => {
  // @ts-ignore
  const drawInteraction = new Draw({
    features: layer.getSource().getFeatures(),
    type: GeometryType.MULTI_POLYGON,
  });
  mapInstance.addInteraction(drawInteraction);

  drawInteraction.on('drawend', (event: DrawEvent) => {
    const { feature }: { feature: Feature } = event;

    // Set geometryName according to features in Geoserver
    feature.set('geom', feature.getGeometry());

    createTransaction('insert', layer, [feature]);

    // Reset geometryName after sending WFS-T request
    feature.setGeometryName('geometry');
  });

  return drawInteraction;
};

export const addModifyInteraction = (mapInstance: Map, layer: VectorLayer): Modify => {
  const modifyInteraction = new Modify({ source: layer.getSource() });
  mapInstance.addInteraction(modifyInteraction);

  const snapInteraction = new Snap({ source: layer.getSource() });
  mapInstance.addInteraction(snapInteraction);

  let modifiedFeatures: Feature[] = [];
  let geometryChangeListener: any; // eslint-disable-line

  modifyInteraction.on('modifystart', (event: ModifyEvent) => {
    modifiedFeatures = [];

    event.features.forEach((feature: Feature) => {
      geometryChangeListener = feature.getGeometry().on('change', () => {
        if (modifiedFeatures.indexOf(feature) === -1) {
          modifiedFeatures.push(feature);
        }
      });
    });
  });

  modifyInteraction.on('modifyend', () => {
    if (geometryChangeListener) {
      geometryChangeListener = null;
    }

    const features: Feature[] = modifiedFeatures;

    // Set geometryName according to features in Geoserver
    features.forEach((feat: Feature) => feat.setGeometryName('geom'));

    createTransaction('update', layer, features);

    // Reset geometryName after sending WFS-T request
    features.forEach((feat: Feature) => feat.setGeometryName('geometry'));
  });

  return modifyInteraction;
};
