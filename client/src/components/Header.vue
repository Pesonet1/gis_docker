<template>
  <header class="header">
    <h1 class="header_title">
      {{ $vuetify.lang.t('$vuetify.header.title') }}
    </h1>
    <div class="header_logout-button">
      <!-- <v-switch
        v-model="$vuetify.theme.dark"
        hide-details
        inset
        label="Theme Dark"
      ></v-switch> -->
      <v-btn
        small
        dark
        color="primary"
        @click="logoutUser"
      >
        {{ $vuetify.lang.t('$vuetify.header.logout') }}
      </v-btn>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: darkmagenta;

  &_title {
    font-family: monospace;
    font-weight: bold;
    font-size: 16px;
    color: white;
  }
}
</style>

<script>
import { secService } from '../main'; // eslint-disable-line

export default {
  methods: {
    logoutUser() {
      secService.signOut();
    },
  },
};
</script>
