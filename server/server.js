const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { Provider } = require('oidc-provider');
const cors = require('cors');

const app = express();
const port = 8085;

const Account = require('./oidcAccount');
const configuration = require('./oidcConfiguration');

app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:8082',
//   methods: ['GET', 'POST'],
//   allowHeaders: ['Origin, Content-Type, Accept, Authorization, Cache'],
//   exposedHeaders: ['X-Requested-With'],
//   credentials: true,
// }));

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const appRoutes = require('./routes/appRoutes');
const oidcRoutes = require('./routes/oidcRoutes');

app.use('/api', appRoutes);

configuration.findAccount = Account.findAccount;

const run = async () => {
  const oidcAdapter = require('./oidcAdapter');
  await oidcAdapter.connect();

  const authPrefix = '/oidc';

  const oidc = new Provider(`http://localhost:${port}/${authPrefix}`, { oidcAdapter, ...configuration });

  /**
   * REMOVE THIS ON PRODUCTION ENVIRONMENT. THIS ONLY DISABLES FORCE USE OF HTTPS ON LOCALHOST
   * https://github.com/panva/node-oidc-provider/blob/master/recipes/implicit_http_localhost.md
   */

  const { invalidate: orig } = oidc.Client.Schema.prototype;

  oidc.Client.Schema.prototype.invalidate = function invalidate(message, code) {
    if (code === 'implicit-force-https' || code === 'implicit-forbid-localhost') {
      return;
    }

    orig.call(this, message);
  };

  oidcRoutes(app, oidc);

  app.use(authPrefix, oidc.callback);
  app.listen(port, () => {
    console.log(`oidc-provider listening on port ${port}, check http://localhost:${port}/${authPrefix}/.well-known/openid-configuration`);
  });
};

run();
