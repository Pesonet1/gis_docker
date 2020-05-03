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
import createMap from '../util/map';
import { wmts, wfs } from '../util/layer';

import 'ol/ol.css';

export default {
  name: 'Map',
  data: () => ({
    map: null,
  }),
  mounted() {
    const backgroundLayer = wmts();
    const wfsLayer = wfs();
    // const wmsLayer = wms();

    this.map = createMap(this.$refs.map, [backgroundLayer, wfsLayer]);
  },
};
</script>
