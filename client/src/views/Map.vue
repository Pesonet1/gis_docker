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

<script>
import { mapState } from 'vuex';
import axios from 'axios';

import LayerSwitcher from '@/components/LayerSwitcher.vue';

import createMap from '@/util/map/map';
import taustakarttaWMTS from '@/util/map/layer/wmts';
import kunnatWMS from '@/util/map/layer/wms';
import kunnatTiledWMS from '@/util/map/layer/tiledWms';
import kunnatWFS from '@/util/map/layer/wfs';
import kunnatVectorTile from '@/util/map/layer/vectorTile';
import popupOverlay from '@/util/map/layer/overlay';

import { getRequest } from '@/util/axios'; // eslint-disable-line

import mousePositionControl from '@/util/map/control/mousePosition';

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
      kunnatTiledWMS(),
      kunnatWFS(),
      kunnatVectorTile(),
    ]);

    this.map.addControl(
      mousePositionControl(document.getElementById('mouse-position'), 0),
    );

    this.mapLayers = this.map.getLayers().array_;

    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    const overlay = popupOverlay(container, closer);

    this.map.addOverlay(overlay);

    this.map.on('singleclick', async (event) => {
      const pixel = this.map.getEventPixel(event.originalEvent);

      const layer = this.map.forEachLayerAtPixel(pixel, (layer2) => layer2);
      const feature = this.map.forEachFeatureAtPixel(pixel, (feature2) => feature2);

      if (feature) {
        console.log('clicked wfs / vectorTile');
      } else {
        if (!('getFeatureInfoUrl' in layer.getSource())) return;

        console.log('clicked wms / tiledWMS');
        const data = await this.getWMSFeatureInfo(event, layer);

        if (data && data.numberReturned) {
          content.innerHTML = `
            <b>Kuntanumero: </b>${data.features[0].properties.kunta}<br/>
            <b>Kuntanimi: </b>${data.features[0].properties.nimi}<br/>
          `;
          overlay.setPosition(event.coordinate);
        } else {
          overlay.setPosition(undefined);
        }
      }
    });
  },
  methods: {
    async getWMSFeatureInfo(event, layer) {
      const viewResolution = this.map.getView().getResolution();
      const url = layer.getSource().getFeatureInfoUrl(
        event.coordinate,
        viewResolution,
        'EPSG:3067',
        { INFO_FORMAT: 'application/json' },
      );

      if (!url) return null;

      return axios.get(url).then((response) => response.data);
    },
  },
};
</script>
