import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';

import {
  email,
  alphaWhiteSpace,
  symbols,
  normalizeAlphaSpace,
  normalizeLength,
} from '../../../common/regex';

import { Tag } from '../Bootstrap/Grid';
import { ValidationField } from './Fields/Input';
import { Button } from './Buttons';

const validate = (values) => {
  const errors = {};
  if (!values.first_name) {
    errors.first_name = 'Please enter your First Name';
  }
  else if (values.first_name.length < 2) {
    errors.first_name = 'Are you sure you entered your first name correctly?';
  }
  else if (!alphaWhiteSpace.test(values.first_name)) {
    errors.first_name = 'Invalid First Name';
  }
  if (!values.last_name) {
    errors.last_name = 'Please enter your Last Name';
  }
  else if (values.last_name.length < 2) {
    errors.last_name = 'Are you sure you entered your last name correctly?';
  }
  else if (!alphaWhiteSpace.test(values.last_name)) {
    errors.first_name = 'Invalid Last Name';
  }
  if (!values.email) {
    errors.email = 'Please enter your Email';
  }
  else if (!email.test(values.email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!values.password) {
    errors.password = 'Please enter your password';
  }
  else if (values.password.length < 8) {
    errors.password = 'Your password should be 8 characters or more';
  }
  else if (!symbols.test(values.password)) {
    errors.password = 'Password requires at least 1 Symbol';
  }
  if (values.confirm_password !== values.password) {
    errors.confirm_password = 'Passwords do not match. Please try again.';
  }
  return errors;
};

const SignupForm = (props) => {
  const {
    handleSubmit,
    submitting,
    pristine,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Tag className="d-flex d-inline-flex align-items-stretch">
        <Field
          name="first_name"
          groupClass="w-100"
          label="First Name"
          type="text"
          normalize={(value, previous) => normalizeAlphaSpace(value, previous, 64)}
          component={ValidationField}
        />
      </Tag>
      <Tag className="d-flex d-inline-flex align-items-stretch">
        <Field
          name="last_name"
          groupClass="w-100"
          label="Last Name"
          type="text"
          normalize={(value, previous) => normalizeAlphaSpace(value, previous, 64)}
          component={ValidationField}
        />
      </Tag>
      <Tag className="d-flex d-inline-flex align-items-stretch">
        <Field
          name="email"
          groupClass="w-100"
          label="Email"
          type="text"
          component={ValidationField}
          withTouch
        />
      </Tag>
      <Tag className="d-flex d-inline-flex align-items-stretch">
        <Field
          name="password"
          groupClass="w-100"
          label="Password"
          type="password"
          normalize={(value, previous) => normalizeLength(value, previous, 64)}
          component={ValidationField}
        />
      </Tag>
      <Tag className="d-flex d-inline-flex align-items-stretch">
        <Field
          name="confirm_password"
          groupClass="w-100"
          label="Confirm Password"
          type="password"
          normalize={(value, previous) => normalizeLength(value, previous, 64)}
          component={ValidationField}
        />
      </Tag>
      <Button
        type="submit"
        value="Sign Up"
        disabled={pristine || submitting}
        loading={submitting}
      />
    </form>
  );
};

SignupForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'SignupForm',
  validate,
  // asyncValidate: Login.asyncValidate,
  // asyncBlurFields: ['email'],
})(SignupForm);
