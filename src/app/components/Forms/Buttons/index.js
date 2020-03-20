/* eslint-disable import/prefer-default-export */
import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';

import s from './Buttons.scss';

export const BlueButton = withStyles(s)(props => (
  <input className={cn(s.btn, s['blue-btn'], props.customClass)} {...props} />
));
