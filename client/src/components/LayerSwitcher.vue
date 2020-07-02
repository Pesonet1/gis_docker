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

<script>
import Map from 'ol/Map';
import { mdiPencil, mdiCancel, mdiDelete } from '@mdi/js';

import InputCheckbox from '@/components/common/InputCheckbox.vue';

import addSelectInteraction from '@/util/map/interaction/select';
import addModifyInteraction from '@/util/map/interaction/modify';
import addPopupInteraction from '@/util/map/interaction/popup';
import wfsTransaction from '@/services/wfsTransaction';

import LayerUtilMixins from '@/mixins/LayerUtilMixins';

export default {
  components: {
    InputCheckbox,
  },
  mixins: [LayerUtilMixins],
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
    popupInteraction: null,
    editableLayer: null,
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
      const layer = this.getLayerByName(this.layers, name);
      if (!layer) return;
      layer.setVisible(visibility);
      // for some reason layer visibility is not refreshing automatically...
      layer.getSource().refresh();

      this.toggleLayerInteractions(visibility, layer);
    },
    toggleLayerInteractions(visibility, layer) {
      // HANDLE VECTOR LAYERS SELECT INTERACTION
      if (visibility && this.layerIsSelectable(layer)) {
        this.selectInteraction = addSelectInteraction(this.map, layer);
      }

      if (!visibility && this.layerIsSelectable(layer)) {
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
    isFeatureSelected() {
      if (!this.selectInteraction) return false;
      return this.selectInteraction.getFeatures().array_.length > 0;
    },
    startVectorLayerModification(layer) {
      this.editableLayer = layer.values_.name;
      this.modifyInteraction = addModifyInteraction(this.map, layer);
    },
    cancelVectorLayerModification() {
      this.map.removeInteraction(this.modifyInteraction);
      this.modifyInteraction = null;
      this.editableLayer = null;
    },
    removeSelectedFeature(layer) {
      layer.getSource().removeFeature(this.selectInteraction.getFeatures().array_[0]);
      wfsTransaction('delete', layer, this.selectInteraction.getFeatures().array_);
    },
  },
};
</script>
