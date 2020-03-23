/* eslint-disable css-modules/no-undef-class */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';
import { SubmissionError } from 'redux-form';

import { staticPaths } from '../../routes';

import loadReCaptcha from '../../components/ReCAPTCHA';
import { Row, Tag } from '../../components/Bootstrap/Grid';
import LoginForm from '../../components/Forms/LoginForm';
import s from './Login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.recaptchaCallback = this.recaptchaCallback.bind(this);
  }

  componentDidMount() {
    loadReCaptcha(this.props.reCAPTCHASiteKey, this.recaptchaCallback, 'login');
  }

  async onSubmit(values) {
    if (!this.captcha || !this.props.challenge || !this.props.csrf) {
      return;
    }
    const resp = await this.props.fetch('/auth/login', {
      method: 'POST',
      headers: {
        'CSRF-Token': this.props.csrf
      },
      body: {
        ...values,
        captcha_token: this.captcha,
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
    // console.log(data);
    window.location.replace(data.redirect_to);
  }

  recaptchaCallback(token) {
    this.captcha = token;
  }

  render() {
    const {
      challenge,
    } = this.props;

    return (
      <Tag className={cn('container', s.login)}>
        <Row noGutters className={cn('mx-auto', s.card)}>
          <Tag className="form-group">
            <span className={s.title}>Login</span>
          </Tag>
          <Tag className="form-group">
            <LoginForm onSubmit={this.onSubmit} />
          </Tag>
          <Tag className="form-group">
            <hr />
          </Tag>
          <Tag className="form-group text-center">
            <a className={s.link} href={`${staticPaths.signup}?lc=${challenge || ''}`}>Create an account</a>
          </Tag>
        </Row>
      </Tag>
    );
  }
}

Login.propTypes = {
  fetch: PropTypes.func.isRequired,
  csrf: PropTypes.string.isRequired,
  reCAPTCHASiteKey: PropTypes.string.isRequired,
  challenge: PropTypes.string.isRequired,
};

export default withStyles(s)(Login);
