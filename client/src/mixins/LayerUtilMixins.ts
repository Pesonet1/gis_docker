import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

import { LayersType } from '@/types';

export default {
  methods: {
    getLayerByName(layers: any[], name: string) { // eslint-disable-line
      return layers.find((layer) => layer.values_.name === name);
    },
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
