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

import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import VectorTileLayer from 'ol/layer/VectorTile';

interface ColorPickerValue {
  alpha: number;
  hex: string;
  hexa: string;
  hsla: {
    a: number;
    h: number;
    l: number;
    s: number;
  };
  hsva: {
    a: number;
    h: number;
    s: number;
    v: number;
  };
  hue: number;
  rgba: {
    a: number;
    b: number;
    g: number;
    r: number;
  };
}

export default Vue.extend({
  props: {
    layers: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    borderColor: {
      rgba: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      },
    } as ColorPickerValue,
    fillColor: {
      rgba: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      },
    } as ColorPickerValue,
  }),
  computed: {
    vectorTileLayerSelected(): boolean {
      // @ts-ignore
      const layer: VectorTileLayer | null = this.layers
        .find((layer2) => layer2 instanceof VectorTileLayer);

      if (!layer) return false;
      if (layer.getVisible()) this.setLayerColor();

      return layer.getVisible();
    },
  },
  methods: {
    setLayerColor() {
      // @ts-ignore
      const layer: VectorTileLayer | null = this.layers
        .find((layer2) => layer2 instanceof VectorTileLayer);

      if (!layer) return;
      if (!layer.getVisible()) return;

      layer.setStyle(new Style({
        stroke: new Stroke({
          color: this.getRgbaColorArray(this.borderColor),
          width: 2,
        }),
        fill: new Fill({
          color: this.getRgbaColorArray(this.fillColor),
        }),
      }));
    },
    getRgbaColorArray(color: ColorPickerValue): [number, number, number, number] {
      return [color.rgba.r, color.rgba.g, color.rgba.b, color.rgba.a];
    },
  },
});
</script>
