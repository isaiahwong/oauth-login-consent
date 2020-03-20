/* eslint-disable no-throw-literal */
/* eslint-disable css-modules/no-undef-class */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import cn from 'classnames';

import {
  email,
  alphaWhiteSpace,
  symbols,
  normalizeAlphaSpace,
  normalizeLength,
} from '../../../common/regex';
import { staticPaths } from '../../routes';
import { receiveCaptcha } from '../../actions/config';

import loadReCaptcha from '../../components/ReCAPTCHA';
import { Row, Tag } from '../../components/Bootstrap/Grid';
import { ValidationField } from '../../components/Forms/Fields/Input';
import { BlueButton } from '../../components/Forms/Buttons';
import s from './Signup.scss';

class Signup extends React.Component {
  static validate(values) {
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
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.recaptchaCallback = this.recaptchaCallback.bind(this);
  }


  componentDidMount() {
    loadReCaptcha(this.props.reCAPTCHASiteKey, this.recaptchaCallback, 'signup');
  }

  async onSubmit(values) {
    if (!this.props.captchaResponse || !this.props.challenge || !this.props.csrf) {
      return;
    }
    const resp = await this.props.fetch('/accounts/signup', {
      method: 'POST',
      headers: {
        'CSRF-Token': this.props.csrf
      },
      body: {
        ...values,
        captcha_token: this.props.captchaResponse,
        challenge: this.props.challenge
      }
    });
    let data = {};
    try {
      data = await resp.json();
    }
    catch (_) {
      // Log to server
    }
    if (resp.status < 200 || resp.status > 302) {
      if (!Array.isArray(data)) {
        return;
      }
      const errors = data.reduce((pv, cv) => {
        const t = pv;
        t[cv.param] = cv.message;
        return t;
      }, {});
      throw new SubmissionError(errors);
    }
    window.location.replace(data.redirect_to);
  }

  recaptchaCallback(token) {
    this.props.receiveCaptcha(token);
  }

  render() {
    const {
      handleSubmit,
      submitting,
      pristine,
      challenge
    } = this.props;

    return (
      <Tag className={cn('container', s.signup)}>
        <Row noGutters className={cn('mx-auto', s.card)}>
          <Tag className="form-group">
            <span className={s.title}>Signup</span>
          </Tag>
          <Tag className="form-group">
            <form onSubmit={handleSubmit(this.onSubmit)}>
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
              <BlueButton
                type="submit"
                value="Sign Up"
                disabled={pristine || submitting}
              />
            </form>
          </Tag>
          <Tag className="form-group">
            <hr />
          </Tag>
          <Tag className="form-group text-center">
            <a className={s.link} href={`${staticPaths.login}?lc=${challenge || ''}`}>Already a member? Log in</a>
          </Tag>
        </Row>
      </Tag>
    );
  }
}

Signup.propTypes = {
  receiveCaptcha: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
  csrf: PropTypes.string.isRequired,
  challenge: PropTypes.string.isRequired,
  reCAPTCHASiteKey: PropTypes.string.isRequired,
  captchaResponse: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

Signup.defaultProps = {
  captchaResponse: ''
};

export default connect(
  state => ({ captchaResponse: state.config.captchaResponse }),
  { receiveCaptcha }
)(withStyles(s)(reduxForm({
  form: 'SignupForm',
  validate: Signup.validate,
})(Signup)));
