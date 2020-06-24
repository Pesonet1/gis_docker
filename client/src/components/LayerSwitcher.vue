<template>
  <div class="layerswitcher">
    <div
      v-for="layer in mapLayers"
      :key="layer.values_.name"
    >
      <label :for="layer.values_.name">
        {{ layer.values_.name }}
      </label>
      <input
        :id="layer.values_.name"
        :name="layer.values_.name"
        type="checkbox"
        :checked="layer.values_.visible"
        @click="toggleLayer(layer.values_.name, !layer.values_.visible)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layerswitcher {
  position: absolute;
  right: 5px;
  top: 5px;
  height: 250px;
  width: 300px;
  border: 1px solid black;
  border-radius: 4px;
  background-color: white;
}
</style>

<script>
export default {
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
    },
    getLayerByName(name) {
      return this.layers.find((layer) => layer.values_.name === name); // eslint-disable-line
    },
  },
};
</script>
