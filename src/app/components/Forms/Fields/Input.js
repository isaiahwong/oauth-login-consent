/* eslint-disable import/prefer-default-export */
import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';

import { Tag } from '../../Bootstrap/Grid';
import s from './Input.scss';

function withTouchError(withTouch, touched, submitFailed, error) {
  // TODO: include non touch
  return withTouch
    ? (touched && (error && <span className={s['form-error']} aria-live="polite">{error}</span>))
    : (submitFailed && (error && <span className={s['form-error']} aria-live="polite">{error}</span>));
}

// Pass withTouch to activate on touch error validation
export const ValidationField = withStyles(s)(({
  withTouch, groupClass, style, inputClass, input, msg, label, type, meta: {
    asyncValidating, touched, error, submitFailed, invalid
  }
}) => (
  <Tag style={style} className={cn('form-group', groupClass, { 'async-validating': asyncValidating })}>
    <input
      className={cn(s.light, inputClass, { 'is-danger': invalid })}
      placeholder={label}
      type={type}
      {...input}
    />
    {withTouchError(withTouch, touched, submitFailed, error)}
    {msg && <Tag className="" aria-live="polite">{msg}</Tag> }
  </Tag>
));
