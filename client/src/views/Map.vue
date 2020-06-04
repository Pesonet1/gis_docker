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

import { getRequest } from '../util/axios'; // eslint-disable-line

import 'ol/ol.css';

export default {
  data: () => ({
    map: null,
  }),
  async mounted() {
    const backgroundLayer = wmts();
    const wfsLayer = wfs();
    // const wmsLayer = wms();

    const users = await getRequest('users').catch((err) => console.error(err));

    console.log(users);

    this.map = createMap(this.$refs.map, [backgroundLayer, wfsLayer]);
  },
};
</script>
