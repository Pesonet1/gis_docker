import VectorLayer from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import { bbox as bboxStrategy } from 'ol/loadingstrategy';

import mapProjection from '../mapProjection';
import getLabel from '../layerLabel';

export default (): VectorLayer => {
  const layer = new VectorLayer({
    declutter: true,
    extent: mapProjection.getExtent(),
    zIndex: 2,
    minZoom: 6,
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
    style: (feature) => getLabel(feature),
  });

  layer.set('name', 'Kunnat WFS');
  layer.setVisible(false);

  return layer;
};
