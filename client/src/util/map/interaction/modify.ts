import Map from 'ol/Map';
import Feature from 'ol/Feature';
import { Modify, Snap } from 'ol/interaction';
import { ModifyEvent } from 'ol/interaction/Modify';
import VectorLayer from 'ol/layer/Vector';

import wfsTransaction from '../../../services/wfsTransaction';

export default (mapInstance: Map, layer: VectorLayer): Modify => {
  const modifyInteraction: Modify = new Modify({ source: layer.getSource() });
  mapInstance.addInteraction(modifyInteraction);

  const snapInteraction: Snap = new Snap({ source: layer.getSource() });
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

    wfsTransaction('update', layer, features);

    // Reset geometryName after sending WFS-T request
    features.forEach((feat: Feature) => feat.setGeometryName('geometry'));
  });

  return modifyInteraction;
};
