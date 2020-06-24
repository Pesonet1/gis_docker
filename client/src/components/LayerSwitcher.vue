<template>
  <div class="layerswitcher">
    <div
      v-for="layer in mapLayers"
      :key="layer.values_.name"
    >
      <InputCheckbox
        v-model="layer.values_.visible"
        :label="layer.values_.name"
        :change-action="toggleLayer.bind(this, layer.values_.name, !layer.values_.visible)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layerswitcher {
  position: absolute;
  right: .5em;
  top: .5em;
  height: 200px;
  width: 250px;
  padding: 0 15px;
  border: 1px solid black;
  border-radius: 4px;
  background-color: white;
}
</style>

<script>
import InputCheckbox from './common/InputCheckbox.vue';

export default {
  components: {
    InputCheckbox,
  },
  props: {
    layers: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    mapLayers: [],
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
    },
    getLayerByName(name) {
      return this.layers.find((layer) => layer.values_.name === name); // eslint-disable-line
    },
  },
};
</script>
