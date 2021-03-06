import Oidc, { UserManager, User } from 'oidc-client';

import store from '../store';
import { SERVER_URL, CLIENT_URL } from '../apiConfig';

export default class SecurityService {
  userManager: UserManager;

  constructor() {
    this.userManager = new Oidc.UserManager({
      userStore: new Oidc.WebStorageStateStore({}),
      authority: `${SERVER_URL}/oidc/`,
      client_id: 'test_implicit_app',
      redirect_uri: `${CLIENT_URL}/static/callback.html`,
      response_type: 'code',
      scope: 'openid profile',
      post_logout_redirect_uri: CLIENT_URL,
      silent_redirect_uri: `${CLIENT_URL}/static/silent-renew.html`,
      accessTokenExpiringNotificationTime: 10,
      automaticSilentRenew: true,
      filterProtocolClaims: true,
      loadUserInfo: true,
    });
  }

  initialize() {
    this.userManager.events.addUserLoaded((user) => {
      console.log('USER LOADED', user);
    });

    this.userManager.events.addAccessTokenExpiring(async () => {
      console.log('ACCESS TOKEN EXPIRING');
      await this.renewToken();
    });

    this.userManager.events.addAccessTokenExpired(() => {
      console.log('ACCESS TOKEN EXPIRED');
      this.userManager.signoutRedirect()
        .catch((err) => console.error('Error while signing out after token expired', err));
    });

    this.userManager.events.addSilentRenewError(() => {
      console.log('SILENT RENEW ERROR');
      store.commit('SET_LOGGED_IN', false);
    });

    this.userManager.events.addUserSignedOut(() => {
      console.log('USER SIGNING OUT');
      this.userManager.signoutRedirect()
        .catch((err) => console.error('Error while signing out', err));
    });

    // Stop this userManager for silent-renew in order to use silent-renew call
    // from silent-renew.html callback
    this.userManager.stopSilentRenew();
  }

  // Renew the token manually
  renewToken() {
    return new Promise((resolve, reject) => {
      this.userManager.signinSilent().then((user) => {
        if (user == null) {
          this.signIn();
          return resolve(null);
        }
        return resolve(user);
      }).catch((err) => {
        console.error('Error while renewing token', err);
        return reject(err);
      });
    });
  }

  // Get the user who is logged in
  getUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.userManager.getUser().then((user) => {
        if (user == null) {
          this.signIn();
          return resolve(null);
        }
        return resolve(user);
      }).catch((err) => {
        console.error('Error while getting user', err);
        return reject(err);
      });
    });
  }

  // Check if there is any user logged in
  getSignedIn() {
    return new Promise((resolve, reject) => {
      this.userManager.getUser().then((user) => {
        if (user == null) {
          this.signIn();
          return resolve(false);
        }
        return resolve(true);
      }).catch((err) => {
        console.error('Error while fetching logged user', err);
        return reject(err);
      });
    });
  }

  // Redirect of the current window to the authorization endpoint.
  signIn() {
    this.userManager.signinRedirect()
      .catch((err) => console.error('Error while redirecting to authorization endpoint', err));
  }

  // Redirect of the current window to the end session endpoint
  signOut() {
    this.userManager.signoutRedirect()
      .catch((err) => console.error('Error while redirecting to end session endpoint', err));
  }

  // Get the profile of the user logged in
  getProfile() {
    return new Promise((resolve, reject) => {
      this.userManager.getUser().then((user) => {
        if (user == null) {
          this.signIn();
          return resolve(null);
        }
        return resolve(user.profile);
      }).catch((err) => {
        console.error('Error while getting user profile', err);
        return reject(err);
      });
    });
  }

  // Get the token id
  getIdToken() {
    return new Promise((resolve, reject) => {
      this.userManager.getUser().then((user) => {
        if (user == null) {
          this.signIn();
          return resolve(null);
        }
        return resolve(user.id_token);
      }).catch((err) => {
        console.error('Error while getting user id token', err);
        return reject(err);
      });
    });
  }

  // Get the session state
  getSessionState() {
    return new Promise((resolve, reject) => {
      this.userManager.getUser().then((user) => {
        if (user == null) {
          this.signIn();
          return resolve(null);
        }
        return resolve(user.session_state);
      }).catch((err) => {
        console.error('Error while getting session state', err);
        return reject(err);
      });
    });
  }

  // Get the access token of the logged in user
  getAccessToken(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.userManager.getUser().then((user) => {
        if (user == null) {
          this.signIn();
          return resolve(null);
        }
        return resolve(user.id_token);
      }).catch((err) => {
        console.error('Error while getting access token', err);
        return reject(err);
      });
    });
  }

  // Takes the scopes of the logged in user
  getScopes() {
    return new Promise((resolve, reject) => {
      this.userManager.getUser().then((user) => {
        if (user == null) {
          this.signIn();
          return resolve(null);
        }
        return resolve(user.scopes);
      }).catch((err) => {
        console.error('Error while getting user scopes', err);
        return reject(err);
      });
    });
  }

  // Get the user roles logged in
  getRole() {
    return new Promise((resolve, reject) => {
      this.userManager.getUser().then((user) => {
        if (user == null) {
          this.signIn();
          return resolve(null);
        }
        return resolve(user.profile.role);
      }).catch((err) => {
        console.error('Error while getting user role', err);
        return reject(err);
      });
    });
  }
}
