import VectorLayer from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import { bbox as bboxStrategy } from 'ol/loadingstrategy';

import { GEOSERVER_URL } from '@/apiConfig';

import mapProjection from '../mapProjection';
import { getFeatureLabelStyle } from '../layerLabel';

export default (typeName: string, layerName: string): VectorLayer => {
  const layer = new VectorLayer({
    declutter: true,
    extent: mapProjection.getExtent(),
    zIndex: 2,
    minZoom: 0,
    maxZoom: 15,
    source: new SourceVector({
      format: new GeoJSON(),
      url: (extent) => (`${GEOSERVER_URL}/geo/wfs`
        + `?service=wfs&version=2.0.0&request=GetFeature&typeNames=${typeName}`
        + '&outputFormat=application/json'
        + `&bbox=${extent.join(',')}`
      ),
      strategy: bboxStrategy,
    }),
    style: (feature) => getFeatureLabelStyle(feature),
  });

  layer.set('name', layerName);
  layer.setVisible(false);

  return layer;
};
