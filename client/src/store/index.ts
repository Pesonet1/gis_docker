import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    selectedFeature: null,
  },
  mutations: {
    SET_LOGGED_IN(state, bool) {
      state.loggedIn = bool;
    },
    SET_SELECTED_FEATURE(state, feature) {
      state.selectedFeature = feature;
    },
  },
  actions: {
  },
  modules: {
  },
});
