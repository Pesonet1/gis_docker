import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

import { MapLayersType } from '@/types';

export const getLayerByName = (
  layers: MapLayersType[] | unknown[],
  name: string,
): MapLayersType | null => {
  if (!layers) return null;
  // @ts-ignore
  return layers.find((layer) => layer.values_.name === name);
};

export const layerIsVisible = (layer: MapLayersType): boolean => {
  if (!layer) return false;
  return layer.getVisible();
};

export const layerIsVector = (layer: MapLayersType): boolean => {
  if (!layer) return false;
  return layer instanceof VectorLayer;
};

export const layerIsVectorTile = (layer: MapLayersType): boolean => {
  if (!layer) return false;
  return layer instanceof VectorTileLayer;
};

export const layerIsSelectable = (layer: MapLayersType): boolean => {
  if (!layer) return false;
  return layerIsVector(layer) || layerIsVectorTile(layer);
};
