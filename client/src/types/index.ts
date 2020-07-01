import VectorTileLayer from 'ol/layer/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';

export type WFSTransactionType = 'insert' | 'update' | 'delete';

export type LayersType = VectorTileLayer | VectorLayer | ImageLayer;

export interface InteractionLayers {
  layer: LayersType;
  changed: () => {};
}
