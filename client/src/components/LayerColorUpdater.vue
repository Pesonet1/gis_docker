<template>
  <div
    v-if="vectorTileLayerSelected"
    class="layercolorupdater"
  >
    <v-color-picker
      v-model="borderColor"
      mode="rgba"
      hide-canvas
      hide-mode-switch
    >
    </v-color-picker>

    <v-color-picker
      v-model="fillColor"
      mode="rgba"
      hide-canvas
      hide-mode-switch
    >
    </v-color-picker>

    <v-btn
      @click="setLayerColor"
      small
      color="primary"
    >
      {{ 'Aseta tason värit' }}
    </v-btn>
  </div>
</template>

<style lang="scss" scoped>
.layercolorupdater {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  position: absolute;
  right: .5em;
  bottom: .5em;
  padding: 15px;
  border: 1px solid black;
  border-radius: 4px;
  background-color: white;
}
</style>

<script lang="ts">
import Vue from 'vue';

import Map from 'ol/Map';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import VectorTileLayer from 'ol/layer/VectorTile';

export default Vue.extend({
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
    borderColor: null as string | null,
    fillColor: null as string | null,
  }),
  computed: {
    vectorTileLayerSelected() {
      const layer = this.layers.find((layer2) => layer2 instanceof VectorTileLayer);
      if (!layer) return false;
      return layer.getVisible();
    },
  },
  methods: {
    setLayerColor() {
      // @ts-ignore
      const layer = this.layers.find((layer2) => layer2 instanceof VectorTileLayer);

      if (!layer || !this.fillColor || !this.borderColor) return;
      if (!layer.getVisible()) return;

      // @ts-ignore
      layer.setStyle(new Style({
        stroke: new Stroke({
          color: [
            this.borderColor.rgba.r,
            this.borderColor.rgba.g,
            this.borderColor.rgba.b,
            this.borderColor.rgba.a,
          ],
          width: 2,
        }),
        fill: new Fill({
          color: [
            this.fillColor.rgba.r,
            this.fillColor.rgba.g,
            this.fillColor.rgba.b,
            this.fillColor.rgba.a,
          ],
        }),
      }));
    },
  },
});
</script>
