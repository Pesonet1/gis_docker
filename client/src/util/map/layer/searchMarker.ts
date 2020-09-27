import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Icon, Style, Circle } from 'ol/style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { Coordinate } from 'ol/coordinate';

import { NOMINATIM_URL } from '@/apiConfig';

export const getMarkerLayer = () => {
  const layer = new VectorLayer({
    source: new VectorSource(),
  });

  layer.set('name', 'marker_layer');

  return layer;
};

export const getMarkerFeature = (
  coordinates: Coordinate,
  iconSrc: string | undefined | null,
): Feature => {
  const marker: Feature = new Feature({
    geometry: new Point(coordinates),
  });

  if (iconSrc) {
    marker.setStyle(
      new Style({
        image: new Icon({
          color: 'black',
          scale: 1.2,
          imgSize: [20, 20],
          src: `${NOMINATIM_URL}${iconSrc}`,
        }),
      }),
    );
  } else {
    marker.setStyle(
      new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: 'white',
          }),
          stroke: new Stroke({
            color: 'darkmagenta',
            width: 3,
          }),
        }),
      }),
    );
  }

  return marker;
};
