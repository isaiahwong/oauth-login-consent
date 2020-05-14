/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import Login from './Login';
import DefaultLayout from '../../components/Layouts/DefaultLayout/DefaultLayout';

async function action({ store, fetch }) {
  const {
    config: {
      csrf, reCAPTCHASiteKey, challenge
    }
  } = store.getState();
  return {
    title: 'Login',
    chunks: ['login'],
    component: (
      <DefaultLayout>
        <Login
          fetch={fetch}
          csrf={csrf}
          reCAPTCHASiteKey={reCAPTCHASiteKey}
          challenge={challenge}
        />
      </DefaultLayout>
    ),
  };
}

export default action;
