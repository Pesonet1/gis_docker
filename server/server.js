const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { Provider } = require('oidc-provider');
const cors = require('cors');

const app = express();
const port = 8085;

app.use(cors({
  origin: 'http://localhost:8082',
  methods: ['GET', 'POST'],
  allowHeaders: ['Origin, Content-Type, Accept, Authorization, Cache'],
  exposedHeaders: ['X-Requested-With'],
  credentials: true,
}));

app.use(helmet());
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const run = async () => {
  const configuration = require('./oidc/configuration');
  const adapter = require('./oidc/adapter');
  await adapter.connect();

  const apiPrefix = '/api';
  const authPrefix = '/oidc';

  const provider = new Provider(`http://localhost:${port}${authPrefix}`, { adapter, ...configuration });

  // provider.proxy = true;
  // provider.keys = process.env.SECURE_KEY.split(',');

  /**
   * REMOVE THIS ON PRODUCTION ENVIRONMENT. THIS ONLY DISABLES FORCE USE OF HTTPS ON LOCALHOST
   * https://github.com/panva/node-oidc-provider/blob/master/recipes/implicit_http_localhost.md
   */

  const { invalidate: orig } = provider.Client.Schema.prototype;

  provider.Client.Schema.prototype.invalidate = function invalidate(message, code) {
    if (code === 'implicit-force-https' || code === 'implicit-forbid-localhost') {
      return;
    }

    orig.call(this, message);
  };

  const appRoutes = require('./routes/appRoutes');
  const oidcRoutes = require('./routes/oidcRoutes');

  appRoutes(apiPrefix, app, provider);
  oidcRoutes(authPrefix, app, provider);

  app.listen(port, () => {
    console.log(`oidc-provider listening on port ${port}, check http://localhost:${port}${authPrefix}/.well-known/openid-configuration`);
  });
};

run();
