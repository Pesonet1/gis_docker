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
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:8082' : 'http://localhost:80',
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

  const proxyPath = '/proxy';
  const apiPath = '/api';
  const authPath = '/oidc';

  const provider = new Provider(`http://localhost:${port}${authPath}`, { adapter, ...configuration });

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

  const proxyRoutes = require('./routes/proxyRoutes');
  const appRoutes = require('./routes/appRoutes');
  const oidcRoutes = require('./routes/oidcRoutes');

  proxyRoutes(proxyPath, app, provider);
  appRoutes(apiPath, app, provider);
  oidcRoutes(authPath, app, provider);

  app.listen(port, () => {
    console.log(`oidc-provider listening on port ${port}, check http://localhost:${port}${authPath}/.well-known/openid-configuration`);
  });
};

run();
