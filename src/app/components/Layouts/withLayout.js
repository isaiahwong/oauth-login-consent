import React from 'react';
import DefaultLayout from './DefaultLayout';

export default (Component = DefaultLayout) => props => (
  <Component>
    {props.children}
  </Component>
);
