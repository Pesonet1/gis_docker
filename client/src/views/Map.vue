<template>
  <div class="ol-map-container">
    <div
      ref="map"
      class="ol-map"
    />
    <div class="mouse-position"></div>
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

.custom-mouse-position {
  position: absolute;
  bottom: 0;
  right: 0;
  color: red;
  z-index: 1000;
  font-weight: bold;
}
</style>

<script>
import createMap from '../util/map';
import { wmts } from '../util/layer'; // vectorTile
import { mousePositionControl } from '../util/control';

import { getRequest } from '../util/axios'; // eslint-disable-line

import 'ol/ol.css';

export default {
  data: () => ({
    map: null,
  }),
  async mounted() {
    const backgroundLayer = wmts();
    // const wfsLayer = wfs();
    // const wmsLayer = wms();

    const users = await getRequest('users').catch((err) => console.error(err));
    console.log(users);

    // vectorTile()
    this.map = createMap(this.$refs.map, [backgroundLayer]);

    this.map.addControl(
      mousePositionControl(document.getElementById('mouse-position'), 0),
    );
  },
};
</script>
