import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';

export type WFSTransactionType = 'insert' | 'update' | 'delete';

export type MapLayersType = TileLayer | VectorLayer | VectorTileLayer | ImageLayer;

export type InteractionLayersType = VectorTileLayer | VectorLayer | ImageLayer;

export interface InteractionLayers {
  layer: InteractionLayersType;
  changed: () => {};
}
