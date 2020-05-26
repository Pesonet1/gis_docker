<template>
  <header class="header">
    <h1 class="header_title">
      Testikartta
    </h1>
    <div class="header_logout-button">
      <button @click="logoutUser">
        Kirjaudu ulos
      </button>
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

  &_logout-button {
    // border-radius: 4px;
    // background-color: white;
    // border: 0;
    // font-size: 14px;
    // color: white;
    // text-decoration: none;
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
