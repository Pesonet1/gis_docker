import Vue from 'vue';
import { User } from 'oidc-client';

import App from './App.vue';

import router from './router';
import store from './store';

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

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
})();
