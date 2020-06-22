<template>
  <div v-if="loggedIn">
    <Header class="header" />
    <router-view class="router"></router-view>
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
}

.header {
  height: 90px;
}

.router {
  height: calc(100% - 90px) !important;
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
