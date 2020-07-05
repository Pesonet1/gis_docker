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
          :title="$vuetify.lang.t('$vuetify.layerswitcher.titles.modifyFeatures')"
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
          :title="$vuetify.lang.t('$vuetify.layerswitcher.titles.deleteFeature')"
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
import { mixins } from 'vue-class-component';
import { mdiPencil, mdiCancel, mdiDelete } from '@mdi/js';

import Map from 'ol/Map';
import { Select, Modify } from 'ol/interaction';
import { EventsKey } from 'ol/events';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

import InputCheckbox from '@/components/common/InputCheckbox.vue';

import addSelectInteraction from '../util/map/interaction/select';
import addModifyInteraction from '../util/map/interaction/modify';
import addPopupInteraction from '../util/map/interaction/popup';
import wfsTransaction from '../services/wfsTransaction';

import LayerUtilMixins from '../mixins/LayerUtilMixins';

import { MapLayersType } from '../types';

export default mixins(LayerUtilMixins).extend({
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
    modifyInteraction: null as Modify | null,
    popupInteraction: null as EventsKey | null,
    editableLayer: null,
    mapLayers: [] as MapLayersType[],
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
    toggleLayer(name: string, visibility: boolean) {
      const layer: MapLayersType | null = (this as any).getLayerByName(this.layers, name); // eslint-disable-line
      if (!layer) return;
      layer.setVisible(visibility);
      // for some reason layer visibility is not refreshing automatically...
      layer.getSource().refresh();

      if (layer instanceof VectorLayer || layer instanceof VectorTileLayer) {
        this.toggleLayerInteractions(visibility, layer);
      }
    },
    toggleLayerInteractions(visibility: boolean, layer: VectorLayer | VectorTileLayer) {
      // HANDLE VECTOR LAYERS SELECT INTERACTION
      if (visibility && (this as any).layerIsSelectable(layer)) { // eslint-disable-line
        this.selectInteraction = addSelectInteraction(this.map, layer);
      }

      if (!visibility && (this as any).layerIsSelectable(layer)) { // eslint-disable-line
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
      if (!visibility && (this as any).layerIsVector(layer)) { // eslint-disable-line
        this.cancelVectorLayerModification();
      }
    },
    isFeatureSelected(): boolean {
      if (!this.selectInteraction) return false;
      // @ts-ignore
      return this.selectInteraction.getFeatures().array_.length > 0;
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
  },
});
</script>
