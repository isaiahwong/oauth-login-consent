/* eslint-disable import/prefer-default-export */
import validator from 'validator';

export function check(params = {}, constraints) {
  const errors = [];

  if (!params) {
    throw new Error('Missing params');
  }

  if (!constraints) {
    throw new Error('Missing constraints');
  }

  Object.keys(constraints).forEach((param) => {
    let value = params[param] || '';
    value = value.toString();
    const paramConstraints = constraints[param];

    Object.keys(paramConstraints).forEach((constraint) => {
      if (typeof validator[constraint] !== 'function') {
        return;
      }
      const { errorMessage = '', options = {}, isTruthyError = false } = paramConstraints[constraint];

      if (!isTruthyError && validator[constraint](value, options)) {
        return;
      }
      if (isTruthyError && !validator[constraint](value, options)) {
        return;
      }
      errors.push({
        param,
        message: errorMessage,
        value,
      });
    });
  });

  return (errors.length && errors) || null;
}
