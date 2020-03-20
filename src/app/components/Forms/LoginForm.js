import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';

import { email } from '../../../common/regex';

import { Tag } from '../Bootstrap/Grid';
import { ValidationField } from './Fields/Input';
import { BlueButton } from './Buttons';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Please enter your Email';
  }
  else if (!email.test(values.email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!values.password) {
    errors.password = 'Please enter your password';
  }
  return errors;
};

const LoginForm = (props) => {
  const {
    handleSubmit,
    submitting,
    pristine,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Tag className="d-flex d-inline-flex align-items-stretch">
        <Field name="email" groupClass="w-100" label="Email" type="text" component={ValidationField} autocomplete="off" />
      </Tag>
      <Tag className="d-flex d-inline-flex align-items-stretch">
        <Field name="password" groupClass="w-100" label="Password" type="password" component={ValidationField} autocomplete="off" />
      </Tag>
      <BlueButton
        type="submit"
        value="Log In"
        disabled={pristine || submitting}
      />
    </form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'LoginForm',
  validate,
  // asyncValidate: Login.asyncValidate,
  // asyncBlurFields: ['email'],
})(LoginForm);
