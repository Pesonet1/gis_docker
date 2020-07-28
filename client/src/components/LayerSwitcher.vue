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
        :cols="layerIsVector(layer) && layerIsVisible(layer) ? 9 : 12"
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
          :title="$vuetify.lang.t('$vuetify.layerSwitcher.titles.drawFeatures')"
          @click="drawableLayer === layer.values_.name
            ? cancelVectorLayerDrawing()
            : startVectorLayerDrawing(layer)"
        >
          <v-icon>
            {{ drawableLayer === layer.values_.name ? mdiCancel : mdiShapePolygonPlus }}
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
          :title="$vuetify.lang.t('$vuetify.layerSwitcher.titles.modifyFeatures')"
          @click="editableLayer === layer.values_.name
            ? cancelVectorLayerModification()
            : startVectorLayerModification(layer)"
        >
          <v-icon>
            {{ editableLayer === layer.values_.name ? mdiCancel : mdiPencil }}
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
          :title="$vuetify.lang.t('$vuetify.layerSwitcher.titles.deleteFeature')"
          :disabled="!isFeatureSelected()"
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
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  position: absolute;
  right: .5em;
  top: .5em;
  width: 250px;
  padding: 5px 15px;
  border: 1px solid black;
  border-radius: 4px;
  background-color: white;
}
</style>

<script lang="ts">
import Vue from 'vue';
import {
  mdiPencil,
  mdiCancel,
  mdiDelete,
  mdiShapePolygonPlus,
} from '@mdi/js';

import Map from 'ol/Map';
import { Select, Modify, Draw } from 'ol/interaction';
import { EventsKey } from 'ol/events';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

import InputCheckbox from '@/components/common/InputCheckbox.vue';

import addSelectInteraction from '../util/map/interaction/select';
import addDrawInteraction from '../util/map/interaction/draw';
import addModifyInteraction from '../util/map/interaction/modify';
import addPopupInteraction from '../util/map/interaction/popup';
import { getLayerByName, layerIsSelectable } from '../util/map/helpers';
import wfsTransaction from '../services/wfsTransaction';

import { MapLayersType } from '../types';

export default Vue.extend({
  components: {
    InputCheckbox,
  },
  props: {
    map: {
      type: Map,
    },
    layers: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    selectInteraction: null as Select | null,
    drawInteraction: null as Draw | null,
    modifyInteraction: null as Modify | null,
    popupInteraction: null as EventsKey | null,
    drawableLayer: null as VectorLayer | null,
    editableLayer: null as VectorLayer | null,
    mapLayers: [] as MapLayersType[],
    mdiPencil,
    mdiCancel,
    mdiDelete,
    mdiShapePolygonPlus,
  }),
  watch: {
    layers(layers: MapLayersType[]) {
      // @ts-ignore
      const filteredLayers = layers.filter((layer) => ['routing_input', 'routing_result', 'marker_layer'].indexOf(layer.values_.name) < 0);
      this.mapLayers = filteredLayers;
    },
  },
  methods: {
    toggleLayer(name: string, visibility: boolean) {
      const layer: MapLayersType | null = getLayerByName(this.layers, name);
      if (!layer) return;
      layer.setVisible(visibility);
      // for some reason layer visibility is not refreshing automatically...
      layer.getSource().refresh();

      this.toggleLayerInteractions(visibility, layer);
    },
    toggleLayerInteractions(visibility: boolean, layer: MapLayersType) {
      if (layer instanceof VectorTileLayer) {
        this.$store.commit('SET_VECTOR_TILE_LAYER_VISIBILITY', layer.getVisible());
      }

      // HANDLE VECTOR LAYERS SELECT INTERACTION
      if (visibility
        && layerIsSelectable(layer)
        && (layer instanceof VectorLayer || layer instanceof VectorTileLayer)) {
        this.selectInteraction = addSelectInteraction(this.map, layer);
      }

      if (!visibility && layerIsSelectable(layer)) {
        if (!this.selectInteraction) return;
        this.map.removeInteraction(this.selectInteraction);
      }

      // HANDLE POPUP INTERACTION FOR ALL LAYERS
      if (visibility && !this.popupInteraction) {
        this.popupInteraction = addPopupInteraction(this.map);
      }

      if (!visibility && this.popupInteraction) {
        const overlay = this.map.getOverlayById('popup');
        overlay.setPosition(undefined);
        this.map.un(this.popupInteraction.type, this.popupInteraction.listener);
        this.popupInteraction = null;
      }

      // HANDLE VECTOR LAYER MODIFICATION INTERACTION
      if (!visibility && this.layerIsVector(layer)) {
        this.cancelVectorLayerModification();
      }
    },
    isFeatureSelected(): boolean {
      if (!this.selectInteraction) return false;
      // @ts-ignore
      return this.selectInteraction.getFeatures().array_.length > 0;
    },
    startVectorLayerDrawing(layer: VectorLayer) {
      // @ts-ignore
      this.drawableLayer = layer.values_.name;
      this.drawInteraction = addDrawInteraction(this.map, layer);
    },
    cancelVectorLayerDrawing() {
      if (!this.drawInteraction) return;
      this.map.removeInteraction(this.drawInteraction);
      this.drawInteraction = null;
      this.drawableLayer = null;
    },
    startVectorLayerModification(layer: VectorLayer) {
      // @ts-ignore
      this.editableLayer = layer.values_.name;
      this.modifyInteraction = addModifyInteraction(this.map, layer);
    },
    cancelVectorLayerModification() {
      if (!this.modifyInteraction) return;
      this.map.removeInteraction(this.modifyInteraction);
      this.modifyInteraction = null;
      this.editableLayer = null;
    },
    removeSelectedFeature(layer: VectorLayer) {
      if (!this.selectInteraction) return;
      // @ts-ignore
      layer.getSource().removeFeature(this.selectInteraction.getFeatures().array_[0]);
      // @ts-ignore
      wfsTransaction('delete', layer, this.selectInteraction.getFeatures().array_);
    },
    layerIsVisible(layer: MapLayersType): boolean {
      if (!layer) return false;
      return layer.getVisible();
    },
    layerIsVector(layer: MapLayersType): boolean {
      if (!layer) return false;
      return layer instanceof VectorLayer;
    },
  },
});
</script>
