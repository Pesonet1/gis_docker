import Map from 'ol/Map';
import { Select } from 'ol/interaction';
import { SelectEvent } from 'ol/interaction/Select';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

import { defaultStyle, selectionStyle } from '../layerStyle';

import store from '../../../store';

export default (mapInstance: Map, layer: VectorLayer | VectorTileLayer): Select => {
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
