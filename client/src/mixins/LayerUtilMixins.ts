import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

import { LayersType } from '@/types';

export default {
  methods: {
    layerIsVector(layer: LayersType) {
      return layer instanceof VectorLayer;
    },
    layerIsVectorTile(layer: LayersType) {
      return layer instanceof VectorTileLayer;
    },
    layerIsVisible(layer: LayersType) {
      return layer.getVisible();
    },
    layerIsSelectable(layer: LayersType) {
      return this.layerIsVector(layer) || this.layerIsVectorTile(layer);
    },
  },
};
