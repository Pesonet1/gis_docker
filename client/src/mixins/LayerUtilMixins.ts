import Vue from 'vue';

import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

import { MapLayersType } from '@/types';

class LayerUtilMixins extends Vue {
  getLayerByName(layers: MapLayersType[], name: string): MapLayersType | null { // eslint-disable-line
    if (layers === undefined) return null;
    // @ts-ignore
    return layers.find((layer) => layer.values_.name === name);
  }

  layerIsVector(layer: MapLayersType): boolean { // eslint-disable-line
    if (!layer) return false;
    return layer instanceof VectorLayer;
  }

  layerIsVectorTile(layer: MapLayersType): boolean { // eslint-disable-line
    if (!layer) return false;
    return layer instanceof VectorTileLayer;
  }

  layerIsVisible(layer: MapLayersType): boolean { // eslint-disable-line
    if (!layer) return false;
    return layer.getVisible();
  }

  layerIsSelectable(layer: MapLayersType): boolean {
    return this.layerIsVector(layer) || this.layerIsVectorTile(layer);
  }
}

export default LayerUtilMixins;
