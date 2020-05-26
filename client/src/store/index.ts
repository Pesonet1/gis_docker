import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
  },
  mutations: {
    SET_LOGGED_IN(state, bool) {
      state.loggedIn = bool;
    },
  },
  actions: {
  },
  modules: {
  },
});
