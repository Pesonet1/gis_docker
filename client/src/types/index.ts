import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';
import { GeoJSONGeometry } from 'ol/format/GeoJSON';

export type WFSTransactionType = 'insert' | 'update' | 'delete';

export type MapLayersType = TileLayer | VectorLayer | VectorTileLayer | ImageLayer;

export type InteractionLayersType = VectorTileLayer | VectorLayer | ImageLayer;

export interface InteractionLayers {
  layer: InteractionLayersType;
  changed: () => {};
}

interface KuntaProperties {
  kunta: string;
  nimi: string;
  namn: string;
  vuosi: number;
}

interface GeoJSONFeature {
  bbox: [number, number, number, number];
  geometry: GeoJSONGeometry;
  geometry_name: string;
  id: string;
  properties: KuntaProperties;
  type: string;
}

export interface WMSFeatureInfo {
  bbox: [number, number, number, number];
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  features: GeoJSONFeature[];
  numberReturned: number;
  timeStamp: string;
  totalFeatures: string;
  type: string;
}

export interface NominatimSearchResponse {
  address: {
    city?: string;
    city_district?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
    suburb?: string;
  };
  boundingBox: number[];
  class: string;
  display_name: string;
  geojson: {
    coordinates: [number, number];
    type: string;
  };
  icon: string;
  importance: number;
  lat: string;
  license: string;
  lon: string;
  osm_id: number;
  osm_type: string;
  place_id: string;
  type: string;
}
