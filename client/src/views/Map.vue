<template>
  <div class="ol-map-container">
    <div
      ref="map"
      class="ol-map"
    />
    <div class="mouse-position"></div>
    <LayerSwitcher
      :map="map"
      :layers="mapLayers"
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
import { mapState } from 'vuex';

import LayerSwitcher from '../components/LayerSwitcher.vue';

import createMap from '../util/map/map';
import taustakarttaWMTS from '../util/map/layer/wmts';
import kunnatWMS from '../util/map/layer/wms';
import kunnatWFS from '../util/map/layer/wfs';
import kunnatVectorTile from '../util/map/layer/vectorTile';
import mousePositionControl from '../util/map/control/mousePosition';

import 'ol/ol.css';

export default {
  components: {
    LayerSwitcher,
  },
  data: () => ({
    map: null,
    mapLayers: [],
  }),
  computed: {
    ...mapState(['selectedFeature']),
  },
  async mounted() {
    this.map = createMap(this.$refs.map, [
      taustakarttaWMTS(),
      kunnatWMS(),
      kunnatWFS(),
      kunnatVectorTile(),
    ]);

    this.map.addControl(
      mousePositionControl(document.getElementById('mouse-position'), 0),
    );

    this.mapLayers = this.map.getLayers().array_;
  },
};
</script>
