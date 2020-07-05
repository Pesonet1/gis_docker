<template>
  <v-checkbox
    v-model="checkboxValue"
    :label="label"
    hide-details
    dense
    @change="changeAction"
  />
</template>

<style scoped>
.v-input {
  margin-top: 0;
  padding: 0;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    changeAction: {
      type: Function,
      default: () => {}, // eslint-disable-line
    },
  },
  computed: {
    checkboxValue: {
      get(): boolean {
        return this.value;
      },
      set(val: string) {
        this.$emit('input', val);
      },
    },
  },
});
</script>
