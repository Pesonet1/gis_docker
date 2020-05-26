<template>
  <div>
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
import Header from './components/Header.vue';

export default {
  components: {
    Header,
  },
};
</script>
