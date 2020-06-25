import Map from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { FeatureLike } from 'ol/Feature';

import store from '../../store';

import { InteractionLayers } from '../../types';

export default (mapInstance: Map) => {
  mapInstance.on('click', (event: MapBrowserEvent) => {
    mapInstance.getLayers().array_
      .forEach((layer: InteractionLayers) => layer.changed()); // eslint-disable-line
    store.commit('SET_SELECTED_FEATURE', null);

    mapInstance.forEachFeatureAtPixel(event.pixel, (feature: FeatureLike, layer) => {
      store.commit('SET_SELECTED_FEATURE', feature);
      layer.changed();
    });
  });
};
