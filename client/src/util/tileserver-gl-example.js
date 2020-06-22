// eslint-disable-file

import olms from 'ol-mapbox-style';
import { defaultResolutions } from 'ol-mapbox-style/dist/util'; // eslint-disable-line

import View from 'ol/View';
import MVT from 'ol/format/MVT';
import VectorTileSource from 'ol/source/VectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';
import * as Extent from 'ol/extent';

const maxResolution = 360 / 512;
defaultResolutions.length = 14;
for (let i = 0; i < 14; ++i) { // eslint-disable-line
  defaultResolutions[i] = maxResolution / Math.pow(2, i + 1); // eslint-disable-line
}

// Use map from createMap method
olms(this.map, 'http://localhost:8100/styles/basic-preview/style.json').then((map) => {
  const resolutions = [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5];

  // const maxResolution = 360 / 512;
  // defaultResolutions.length = 14;
  // for (let i = 0; i < 14; ++i) { // eslint-disable-line
  //   defaultResolutions[i] = maxResolution / Math.pow(2, i + 1); // eslint-disable-line
  // }

  const tileGrid = new TileGrid({
    extent: projection.getExtent(),
    resolutions,
    tileSize: [256, 256],
  });

  const mapboxStyle = this.map.get('mapbox-style');

  this.map.getLayers().forEach((layer) => {
    const mapboxSource = layer.get('mapbox-source');

    if (mapboxSource && mapboxStyle.sources[mapboxSource].type === 'vector') {
      const source = layer.getSource();

      layer.setSource(new VectorTileSource({
        format: new MVT(),
        minZoom: 1,
        maxZoom: 14,
        urls: source.getUrls(),
        tileGrid,
        projection,
      }));
    }
  });

  this.map = map;
});