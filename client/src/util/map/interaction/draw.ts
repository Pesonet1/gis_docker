import Map from 'ol/Map';
import Feature from 'ol/Feature';
import { Draw } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';

import wfsTransaction from '../../../services/wfsTransaction';

export default (mapInstance: Map, layer: any): Draw => {
  const drawInteraction = new Draw({
    features: layer.getSource().getFeatures(),
    type: GeometryType.MULTI_POLYGON,
  });
  mapInstance.addInteraction(drawInteraction);

  drawInteraction.on('drawend', (event: DrawEvent) => {
    const { feature }: { feature: Feature } = event;

    // Set geometryName according to features in Geoserver
    feature.set('geom', feature.getGeometry());

    wfsTransaction('insert', layer, [feature]);

    // Reset geometryName after sending WFS-T request
    feature.setGeometryName('geometry');
  });

  return drawInteraction;
};
