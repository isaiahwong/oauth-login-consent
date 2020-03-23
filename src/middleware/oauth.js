/* eslint-disable quote-props */
/* eslint-disable import/prefer-default-export */
import url from 'url';
import express from 'express';
import logger from 'esther';

import { check } from '../common/validator';
import { alphaWhiteSpace, symbols } from '../common/regex';

import AccountsService from '../oauth/service';

const app = express();
let service;

const matchHeaders = {
  'user-agent': 1,
  'cookie': 1,
  'x-forwarded-for': 1,
  'login-challenge': 1,
  'consent-challenge': 1,
  'captcha-response': 1,
  'accept-language': 1,
  'accept-encoding': 1,
  'x-forwarded-client-cert': 1,
  'x-request-id': 1,
  'x-b3-traceid': 1,
  'x-b3-spanId': 1,
  'x-b3-parentspanid': 1,
  'x-b3-sampled': 1,
  'x-b3-flags': 1,
  'b3': 1,
};

function getIP(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

export async function initService() {
  if (!service) {
    service = new AccountsService({
      serviceURL: process.env.ACCOUNTS_SERVICE_ADDR,
      deadline: parseInt(process.env.ACCOUNTS_SERVICE_DEADLINE, 10) // 10 sec
    });
    try {
      await service.connect();
    }
    catch (err) {
      logger.error(err);
    }
  }
}

async function isAuthenticated(challenge, req, res, next) {
  try {
    req.headers['login-challenge'] = challenge;
    req.headers['x-forward-for'] = getIP(req);
    const metadata = AccountsService.getMetadataHeaders(req.headers, matchHeaders);
    const resp = await service.loginWithChallenge(null, metadata);
    if (!resp.skip) {
      req.login_challenge = challenge;
      next();
      return;
    }
    res.redirect(resp.redirect_to);
    return;
  }
  catch (error) {
    next(error);
  }
}

app.get('/auth/login/challenge', async (req, res, next) => {
  const { query } = url.parse(req.url, true);
  // The challenge is used to fetch information about the login request from ORY Hydra.
  const challenge = query.login_challenge;
  if (!challenge) {
    next(new Error('Invalid challenge'));
  }
  try {
    req.headers['login-challenge'] = challenge;
    req.headers['x-forward-for'] = getIP(req);
    const metadata = AccountsService.getMetadataHeaders(req.headers, matchHeaders);
    const resp = await service.loginWithChallenge(null, metadata);
    if (!resp.skip) {
      res.redirect(`/auth/login?lc=${challenge}`);
      return;
    }
    res.redirect(resp.redirect_to);
    return;
  }
  catch (error) {
    next(error);
  }
});

app.get('/auth/login', (req, res, next) => {
  const { query } = url.parse(req.url, true);
  const challenge = query.lc;
  if (!challenge) {
    next(new Error('Invalid challenge'));
    return;
  }
  isAuthenticated(challenge, req, res, next);
});

app.post('/auth/login', async (req, res) => {
  const errors = check(req.body, {
    email: {
      isEmail: {
        errorMessage: 'Please enter a valid email',
        options: {
          require_tld: true,
        }
      },
    },
    password: { // password
      isEmpty: {
        errorMessage: 'Wrong email or password',
        isTruthyError: true,
      },
    },
    captcha_token: {
      isEmpty: {
        errorMessage: 'Missing Captcha',
        isTruthyError: true,
      },
    },
    challenge: {
      isEmpty: {
        errorMessage: 'Missing challenge',
        isTruthyError: true,
      },
    }
  });
  if (errors) {
    res.status(403).json(errors);
    return;
  }
  try {
    req.headers['captcha-response'] = req.body.captcha_token;
    req.headers['login-challenge'] = req.body.challenge;
    req.headers['x-forward-for'] = getIP(req);
    const metadata = AccountsService.getMetadataHeaders(req.headers, matchHeaders);

    const resp = await service.authenticate({
      email: req.body.email,
      password: req.body.password,
    }, metadata);

    res.json(resp);
  }
  catch (err) {
    if (err.errors) {
      res.status(403).json(err.errors);
      return;
    }
    logger.error(err);
    res.status(403).json();
  }
});

app.get('/auth/signup', (req, res, next) => {
  const { query } = url.parse(req.url, true);
  const challenge = query.lc;
  if (!challenge) {
    next(new Error('Invalid challenge'));
    return;
  }
  isAuthenticated(challenge, req, res, next);
});

app.post('/auth/signup', async (req, res) => {
  const errors = check(req.body, {
    first_name: {
      notEmpty: true,
      errorMessage: 'Please enter your First Name',
      isLength: {
        options: {
          min: 2,
          max: 64
        },
        errorMessage: 'Are you sure you entered your first name correctly?'
      },
      matches: {
        options: alphaWhiteSpace,
        errorMessage: 'PLease enter a valid first name'
      },
    },
    last_name: {
      notEmpty: true,
      errorMessage: 'Please enter your Last Name',
      isLength: {
        options: {
          min: 2,
          max: 64
        },
        errorMessage: 'Are you sure you entered your last name correctly?'
      },
      matches: {
        options: alphaWhiteSpace,
        errorMessage: 'Please enter a valid last name'
      },
    },
    email: {
      isEmail: {
        errorMessage: 'Please enter a valid email',
        options: {
          require_tld: true,
        }
      },
    },
    password: { // password
      isLength: {
        options: {
          min: 8,
          max: 64
        },
        errorMessage: 'Please enter a valid password'
      },
      matches: {
        options: symbols,
        errorMessage: 'Please enter a valid password'
      },
      equals: {
        options: req.body.confirm_password, // confirm password
        errorMessage: 'Passwords do not match. Please try again.'
      },
    },
    captcha_token: {
      isEmpty: {
        errorMessage: 'Missing Captcha',
        isTruthyError: true,
      },
    },
    challenge: {
      isEmpty: {
        errorMessage: 'Missing challenge',
        isTruthyError: true,
      },
    }
  });
  if (errors) {
    res.status(403).json(errors);
  }
  try {
    req.headers['captcha-response'] = req.body.captcha_token;
    req.headers['login-challenge'] = req.body.challenge;
    req.headers['x-forward-for'] = getIP(req);
    const metadata = AccountsService.getMetadataHeaders(req.headers, matchHeaders);

    // Validate Email
    let resp = await service.emailExists({ email: req.body.email }, metadata);
    if (resp.exist) {
      res.status(403).json([{
        param: 'email',
        message: 'An account already exists with this email.',
        value: req.body.email,
      }]);
      return;
    }

    resp = await service.signUp({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
    }, metadata);
    res.json(resp);
  }
  catch (err) {
    logger.error(err);
    res.status(403).json();
  }
});

app.get('/auth/consent/challenge', async (req, res, next) => {
  const { query } = url.parse(req.url, true);
  const challenge = query.consent_challenge;
  try {
    req.headers['consent-challenge'] = challenge;
    req.headers['x-forward-for'] = getIP(req);
    const metadata = AccountsService.getMetadataHeaders(req.headers, matchHeaders);
    const resp = await service.consentWithChallenge(null, metadata);
    res.redirect(resp.redirect_to);
  }
  catch (err) {
    next(err);
  }
});


export default app;
