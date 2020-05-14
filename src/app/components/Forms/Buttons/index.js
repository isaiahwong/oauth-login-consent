/* eslint-disable import/prefer-default-export */
import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';

import withThemeContext from '../../Theme/withThemeContext';
import s from './Buttons.scss';

export const Button = withThemeContext(withStyles(s)(props => (
  <button
    type="button"
    className={cn(s.btn, s._btn, props.customClass)}
    style={{
      backgroundColor: (props.context && props.context.primaryColor) || '#1820D3'
    }}
    {...props}
  >
    <span>
      {(props.loading && <i className="fa fa-circle-o-notch fa-spin" />) || null}
      {' '}
      {props.value}
    </span>

  </button>
)));
