<template>
  <div
    v-if="vectorTileLayerVisible"
    class="layercolorupdater"
  >
    <div>
      {{ $vuetify.lang.t('$vuetify.layerColorUpdater.borderColor') }}
    </div>

    <v-color-picker
      v-model="borderColor.rgba"
      mode="rgba"
      hide-canvas
      hide-mode-switch
    >
    </v-color-picker>

    <div>
      {{ $vuetify.lang.t('$vuetify.layerColorUpdater.fillColor') }}
    </div>

    <v-color-picker
      v-model="fillColor.rgba"
      mode="rgba"
      hide-canvas
      hide-mode-switch
    >
    </v-color-picker>
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
import { mapState } from 'vuex';

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
        r: 0,
        g: 0,
        b: 0,
        a: 0.8,
      },
    } as ColorPickerValue,
    fillColor: {
      rgba: {
        r: 0,
        g: 0,
        b: 255,
        a: 0.8,
      },
    } as ColorPickerValue,
  }),
  watch: {
    vectorTileLayerVisible: {
      handler(visible: boolean) {
        if (visible) this.setLayerColor();
      },
    },
    borderColor: {
      deep: true,
      handler() { this.setLayerColor(); },
    },
    fillColor: {
      immediate: false,
      deep: true,
      handler() { this.setLayerColor(); },
    },
  },
  computed: {
    ...mapState(['vectorTileLayerVisible']),
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
          width: 1,
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
