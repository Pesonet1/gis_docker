<template>
  <v-app v-if="loggedIn">
    <Header class="header" />

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<style lang="scss">
body {
  margin: 0;
}

.header {
  height: 90px;
}
</style>

<script>
import { mapState } from 'vuex';

import Header from './components/Header.vue';

export default {
  components: {
    Header,
  },
  computed: {
    ...mapState(['loggedIn']),
  },
};
</script>
