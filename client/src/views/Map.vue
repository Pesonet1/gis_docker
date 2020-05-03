<template>
  <div class="ol-map-container">
    <div
      ref="map"
      class="ol-map"
    />
  </div>
</template>

<style lang="scss">
.ol-map-container {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.ol-map {
  height: 100%;
  width: 100%;
}
</style>

<script>
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import SourceWMTS from 'ol/source/WMTS';
import Image from 'ol/layer/Image';
import SourceWMS from 'ol/source/ImageWMS';
import TileWMTS from 'ol/tilegrid/WMTS';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import * as Extent from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';

import { bbox as bboxStrategy } from 'ol/loadingstrategy';

import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';

import projection from '../components/projection';

import 'ol/ol.css';

const projectionExtent = projection.getExtent();
const matrixIds = new Array(16).fill(0).map((value, index) => index);

const backgroundMap = new TileLayer({
  name: 'taustakartta',
  // opacity: 0.65,
  source: new SourceWMTS({
    url: 'http://localhost/mapproxy/service?',
    layer: 'Taustakartta',
    format: 'image/png',
    matrixSet: 'JHS180',
    style: 'default',
    tileGrid: new TileWMTS({
      origin: Extent.getTopLeft(projectionExtent),
      resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
      matrixIds,
      extent: projectionExtent,
    }),
    projection,
    transition: 0,
  }),
});

const wms = new Image({
  id: 'kunnat_wms',
  name: 'kunnat_wms',
  type: 'wms',
  extent: projectionExtent,
  zIndex: 1,
  opacity: 0.65,
  source: new SourceWMS({
    url: 'http://localhost/geoserver/geo/wms',
    params: {
      LAYERS: 'geo:kunnat_2019',
      TRANSPARENT: true,
      FORMAT: 'image/png8',
      RATIO: 1,
    },
    serverType: 'geoserver',
    transition: 0,
    projection,
  }),
});

const getTextStyle = (
  textFont,
  fillColor,
  strokeColor,
  strokeWidth,
  offX,
  offY,
  place,
  labelText,
) => (new Text({
  font: textFont,
  fill: new Fill({
    color: fillColor,
  }),
  stroke: new Stroke({
    color: strokeColor,
    width: strokeWidth,
  }),
  offsetX: offX,
  offsetY: offY,
  placement: place,
  text: labelText,
  overflow: true,
  padding: [5, 5, 5, 5],
}));

const getLabelText = (feature) => {
  const text = feature.get('nimi');

  if (text) {
    return getTextStyle('11px Verdana', 'white', 'black', 3, 0, 0, 'point', text);
  }

  return null;
};

const getVectorLayerStyle = (feature) => (
  new Style({
    stroke: new Stroke({
      color: 'black',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.5)',
    }),
    text: getLabelText(feature),
  }));

const wfs = new VectorLayer({
  id: 'kunnat_wfs',
  name: 'kunnat_wfs',
  type: 'wfs',
  extent: projectionExtent,
  zIndex: 2,
  minZoom: 6,
  source: new VectorSource({
    format: new GeoJSON(),
    url: (extent) => ('http://localhost/geoserver/geo/wfs'
      + '?service=wfs&version=2.0.0&request=GetFeature&typeNames=geo:kunnat_2019'
      + '&outputFormat=application/json'
      + `&bbox=${extent.join(',')}`
    ),
    strategy: bboxStrategy,
    projection,
  }),
  style: getVectorLayerStyle,
});

export default {
  name: 'Map',
  data: () => ({
    map: null,
  }),
  mounted() {
    this.map = new Map({
      target: this.$refs.map,
      layers: [
        backgroundMap,
        // new TileLayer({
        //   source: new XYZ({
        //     url: 'http://localhost/mapproxy/service?service=wmts&request=GetTile&version=1.0.0&tilematrixset=JHS180&tilematrix={z}&tilerow={y}&tilecol={x}&layer=Taustakartta&format=image/png&style=default',
        //   }),
        // }),
      ],
      view: new View({
        projection,
        center: [400000, 7000000],
        zoom: 3,
        maxZoom: 15,
        minZoom: 2,
        enableRotation: false,
      }),
      loadTilesWhileAnimating: true,
      loadTilesWhileInteracting: true,
    });

    // this.map.addLayer(wms);
    this.map.addLayer(wfs);
  },
};
</script>
