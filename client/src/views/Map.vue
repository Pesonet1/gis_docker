<template>
  <div class="ol-map-container">
    <div
      ref="map"
      class="ol-map"
    />
    <div>ts</div>
  </div>
</template>

<style scoped>
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
import XYZ from 'ol/source/XYZ';

import 'ol/ol.css';

export default {
  name: 'Map',
  mounted() {
    new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          // source: new OSM(),
          source: new XYZ({
            url: 'http://localhost/mapproxy/service?service=wmts&request=GetTile&version=1.0.0&tilematrixset=JHS180&tilematrix={z}&tilerow={y}&tilecol={x}&layer=Taustakartta&format=image/png&style=default',
          }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  },
};
</script>
