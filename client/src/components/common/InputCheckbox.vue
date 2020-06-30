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
}
</style>

<script>
export default {
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
      get() { return this.value; },
      set(val) { this.$emit('input', val); },
    },
  },
};
</script>
