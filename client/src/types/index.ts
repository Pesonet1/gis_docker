import VectorTileLayer from 'ol/layer/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';

export interface InteractionLayers {
  layer: VectorTileLayer | VectorLayer | ImageLayer;
  changed: () => {};
}
