import Map from 'ol/Map';
import { Select } from 'ol/interaction';
import { SelectEvent } from 'ol/interaction/Select';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import Feature from 'ol/Feature';

import store from '@/store';

import { defaultStyle, selectionStyle } from '../layerStyle';

export default (mapInstance: Map, layer: VectorLayer | VectorTileLayer): Select => {
  const selectInteraction: Select = new Select();
  mapInstance.addInteraction(selectInteraction);

  selectInteraction.on('select', (event: SelectEvent) => {
    event.selected.forEach((feature: Feature) => {
      feature.setStyle(selectionStyle());
    });

    event.deselected.forEach((feature: Feature) => {
      feature.setStyle(defaultStyle());
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
