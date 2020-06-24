import Vue from 'vue';
import { User } from 'oidc-client';

import App from './App.vue';

import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import SecurityService from './services/securityService';
import { createRepository } from './util/axios'; // eslint-disable-line

Vue.config.productionTip = false;

export const secService = new SecurityService(); // eslint-disable-line

if (!secService) {
  throw new Error('SecurityService was not initialized');
}

(async () => {
  secService.initialize();
  await createRepository();

  const user: User | null = await secService.getUser();

  if (user) {
    store.commit('SET_LOGGED_IN', true);

    if (user.expired) {
      await secService.renewToken();
    }
  }

  const userLoggedIn = await secService.getSignedIn();
  if (!userLoggedIn) return;

  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
})();
