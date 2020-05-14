/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import Client from './Client';
import DefaultLayout from '../../components/Layouts/DefaultLayout/DefaultLayout';

async function action({ store, fetch }) {
  const {
    config: {
      csrf, reCAPTCHASiteKey, challenge
    }
  } = store.getState();

  return {
    title: 'Loading',
    chunks: ['clientauth'],
    component: (
      <DefaultLayout>
        <Client
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
