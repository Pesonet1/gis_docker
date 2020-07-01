<template>
  <div class="layerswitcher">
    <v-row
      v-for="layer in mapLayers"
      :key="layer.values_.name"
      class="my-2"
      align="center"
      no-gutters
    >
      <v-col
        :cols="layerIsVector(layer) && layerIsVisible(layer) ? 10 : 12"
      >
        <InputCheckbox
          v-model="layer.values_.visible"
          :label="layer.values_.name"
          :change-action="toggleLayer.bind(this, layer.values_.name, !layer.values_.visible)"
        />
      </v-col>

      <v-col
        v-if="layerIsVector(layer) && layerIsVisible(layer)"
        cols="1"
        align="end"
      >
        <v-btn
          icon
          x-small
          @click="modifyLayer === layer.values_.name
            ? cancelVectorLayerModification()
            : startVectorLayerModification(layer)"
        >
          <v-icon>
            {{ modifyLayer === layer.values_.name ? mdiCancel : mdiPencil }}
          </v-icon>
        </v-btn>
      </v-col>

      <v-col
        v-if="layerIsVector(layer) && layerIsVisible(layer)"
        cols="1"
        align="end"
      >
        <v-btn
          icon
          x-small
          @click="removeSelectedFeature(layer)"
        >
          <v-icon>
            {{ mdiDelete }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.layerswitcher {
  position: absolute;
  right: .5em;
  top: .5em;
  height: 160px;
  width: 250px;
  padding: 0 15px;
  border: 1px solid black;
  border-radius: 4px;
  background-color: white;
}
</style>

<script>
import Map from 'ol/Map';
import { mdiPencil, mdiCancel, mdiDelete } from '@mdi/js';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

import InputCheckbox from './common/InputCheckbox.vue';

import addSelectInteraction from '../util/map/interaction/select';
import addModifyInteraction from '../util/map/interaction/modify';
import wfsTransaction from '../services/wfsTransaction';

export default {
  components: {
    InputCheckbox,
  },
  props: {
    map: {
      type: Map,
      default: null,
    },
    layers: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    selectInteraction: null,
    modifyInteraction: null,
    modifyLayer: null,
    mapLayers: [],
    mdiPencil,
    mdiCancel,
    mdiDelete,
  }),
  watch: {
    layers(newVal) {
      this.mapLayers = newVal;
    },
  },
  methods: {
    toggleLayer(name, visibility) {
      const layer = this.getLayerByName(name);
      if (!layer) return;
      layer.setVisible(visibility);
      // for some reason layer visibility is not refreshing automatically...
      layer.getSource().refresh();

      if (visibility && (layer instanceof VectorLayer || layer instanceof VectorTileLayer)) {
        this.selectInteraction = addSelectInteraction(this.map, layer);
      }

      if (!visibility && (layer instanceof VectorLayer || layer instanceof VectorTileLayer)) {
        this.map.removeInteraction(this.selectInteraction);
      }

      if (this.layerIsVector(layer) && this.modifyLayer) {
        this.cancelVectorLayerModification();
      }
    },
    getLayerByName(name) {
      return this.layers.find((layer) => layer.values_.name === name); // eslint-disable-line
    },
    layerIsVector(layer) {
      return layer instanceof VectorLayer;
    },
    layerIsVisible(layer) {
      return layer.getVisible();
    },
    startVectorLayerModification(layer) {
      this.modifyLayer = layer.values_.name;
      this.modifyInteraction = addModifyInteraction(this.map, layer);
    },
    cancelVectorLayerModification() {
      this.map.removeInteraction(this.modifyInteraction);
      this.modifyInteraction = null;
      this.modifyLayer = null;
    },
    removeSelectedFeature(layer) {
      layer.getSource().removeFeature(this.selectInteraction.getFeatures().array_[0]);
      wfsTransaction('delete', layer, this.selectInteraction.getFeatures().array_);
    },
  },
};
</script>
