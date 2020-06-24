<template>
  <div class="ol-map-container">
    <div
      ref="map"
      class="ol-map"
    />
    <div class="mouse-position"></div>
    <LayerSwitcher :layers="mapLayers" />
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
  bottom: .5rem;
  right: .5rem;
  color: red;
  z-index: 1000;
  font-weight: bold;
}
</style>

<script>
import LayerSwitcher from '../components/LayerSwitcher.vue';

import createMap from '../util/map/map';
import {
  backgroundLayer,
  kunnatWMS,
  kunnatWFS,
  kunnatVectorTile,
} from '../util/map/layer';
import { mousePositionControl } from '../util/map/control';

import { getRequest } from '../util/axios'; // eslint-disable-line

import 'ol/ol.css';

export default {
  components: {
    LayerSwitcher,
  },
  data: () => ({
    map: null,
    mapLayers: [],
  }),
  async mounted() {
    const users = await getRequest('users').catch((err) => console.error(err));
    console.log(users);

    // vectorTile()
    this.map = createMap(this.$refs.map, [
      backgroundLayer(),
      kunnatWMS(),
      kunnatWFS(),
      kunnatVectorTile(),
    ]);

    this.map.addControl(
      mousePositionControl(document.getElementById('mouse-position'), 0),
    );

    this.mapLayers = this.map.getLayers().array_; // eslint-disable-line
  },
};
</script>
