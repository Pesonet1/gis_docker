const { urlencoded } = require('express');

const SequelizeModels = require('../models').sequelize.models;

const body = urlencoded({ extended: false });

module.exports = (app, provider) => {
  const { constructor: { errors: { SessionNotFound } } } = provider;

  function setNoCache(req, res, next) {
    res.set('Pragma', 'no-cache');
    res.set('Cache-Control', 'no-cache, no-store');
    next();
  }

  app.get('/interaction/:uid', setNoCache, async (req, res, next) => {
    try {
      const { uid, prompt, params } = await provider.interactionDetails(req, res);
      const client = await provider.Client.find(params.client_id);

      if (prompt.name === 'login') {
        return res.render('login', {
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Sign-in',
          flash: undefined,
        });
      }
  
      return res.render('interaction', {
        client,
        uid,
        details: prompt.details,
        params,
        title: 'Authorize',
      });
    } catch (err) {
      return next(err);
    }
  });

  app.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => {
    try {
      const { uid, prompt, params } = await provider.interactionDetails(req, res);

      const client = await provider.Client.find(params.client_id);

      SequelizeModels.Users.findOne({
        where: {
          email: req.body.email,
          password: req.body.password
        }
      }).then(async (account) => {
        if (!account) {
          res.render('login', {
            client,
            uid,
            details: prompt.details,
            params: {
              ...params,
              login_hint: req.body.email,
            },
            title: 'Sign-in',
            flash: 'Invalid email or password.',
          });
          return;
        }

        const result = {
          login: {
            account: account.id.toString(),
          },
        };

        await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
      });
    } catch (err) {
      next(err);
    }
  });

  app.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => {
    try {
      const result = {
        consent: {
          // rejectedScopes: [], // < uncomment and add rejections here
          // rejectedClaims: [], // < uncomment and add rejections here
        },
      };

      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
    } catch (err) {
      next(err);
    }
  });

  app.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
    try {
      const result = {
        error: 'access_denied',
        error_description: 'End-User aborted interaction',
      };
      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });

      // TODO Redirect to login
    } catch (err) {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (err instanceof SessionNotFound) {
      // handle interaction expired / session not found error
    }
    next(err);
  });
};
