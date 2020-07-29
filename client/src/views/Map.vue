<template>
  <div class="ol-map-container">
    <div
      ref="map"
      class="ol-map"
    />
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
    <div class="mouse-position"></div>
    <AddressSearch :map="map" />
    <LayerSwitcher
      :map="map"
      :layers="mapLayers"
    />
    <Router :map="map" />
    <LayerColorUpdater :layers="mapLayers" />
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

.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}

.ol-popup:after, .ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.ol-popup-closer:after {
  content: "✖";
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

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import MousePosition from 'ol/control/MousePosition';

import AddressSearch from '@/components/AddressSearch.vue';
import LayerSwitcher from '@/components/LayerSwitcher.vue';
import LayerColorUpdater from '@/components/LayerColorUpdater.vue';
import Router from '@/components/Router.vue';

import { MapLayersType } from '../types';

import createMap from '../util/map/map';
import taustakarttaWMTS from '../util/map/layer/wmts';
import getWMSLayer from '../util/map/layer/wms';
import getTiledWMSLayer from '../util/map/layer/tiledWms';
import getWFSLayer from '../util/map/layer/wfs';
import getVectorTileLayer from '../util/map/layer/vectorTile';
import popupOverlay from '../util/map/layer/popupOverlay';
// import wpsSimplify from '../util/map/process/wpsSimplify';

import mousePositionControl from '../util/map/control/mousePosition';

import 'ol/ol.css';

export default Vue.extend({
  components: {
    AddressSearch,
    LayerSwitcher,
    LayerColorUpdater,
    Router,
  },
  data: () => ({
    map: null as Map | null,
    mapLayers: [] as MapLayersType[],
  }),
  computed: {
    ...mapState(['selectedFeature']),
  },
  async mounted() {
    this.map = createMap(this.$refs.map, [
      taustakarttaWMTS(),
      getWMSLayer('geo:kunnat', 'Kunnat WMS'),
      getWMSLayer('geo:corine', 'CORINE Maankäyttö ja maapeite'),
      getTiledWMSLayer('geo:kunnat', 'Kunnat TiledWMS'),
      getWFSLayer('geo:kunnat', 'Kunnat WFS'),
      getVectorTileLayer('geo:kunnat', 'Kunnat VectorTile'),
    ]);

    const mousePositionElement: HTMLElement | null = document.getElementById('mouse-position');
    const containerElement: HTMLElement | null = document.getElementById('popup');
    const closerElement: HTMLElement | null = document.getElementById('popup-closer');

    if (containerElement && closerElement) {
      const overlay: Overlay | null = popupOverlay(containerElement, closerElement);
      if (overlay) this.map.addOverlay(overlay);
    }

    if (mousePositionElement) {
      const mousePosition: MousePosition | null = mousePositionControl(mousePositionElement, 0);
      if (mousePosition) this.map.addControl(mousePosition);
    }

    // @ts-ignore
    this.mapLayers = this.map.getLayers().array_;

    // wpsSimplify(this.map);
  },
});
</script>
