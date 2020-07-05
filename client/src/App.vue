<template>
  <v-app v-if="loggedIn">
    <Header class="header" />

    <v-main>
      <router-view></router-view>
    </v-main>
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

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

import Header from '@/components/Header.vue';

export default Vue.extend({
  components: {
    Header,
  },
  computed: {
    ...mapState(['loggedIn']),
  },
});
</script>
