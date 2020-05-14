/* eslint-disable no-throw-literal */
/* eslint-disable css-modules/no-undef-class */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';

import { staticPaths } from '../../routes';

import withThemeProvider from '../../components/Theme/withThemeContext';
import loadReCaptcha from '../../components/ReCAPTCHA';
import { Row, Tag } from '../../components/Bootstrap/Grid';
import s from './Signup.scss';
import SignupForm from '../../components/Forms/SignupForm';

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.recaptchaCallback = this.recaptchaCallback.bind(this);
  }

  componentDidMount() {
    loadReCaptcha(this.props.reCAPTCHASiteKey, this.recaptchaCallback, 'signup');
  }

  async onSubmit(values) {
    if (!this.captcha || !this.props.challenge || !this.props.csrf) {
      return;
    }
    const resp = await this.props.fetch('/auth/signup', {
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
    window.location.replace(data.redirect_to);
  }

  recaptchaCallback(token) {
    this.captcha = token;
  }

  Logo() {
    const { context } = this.props;
    if (!context.logoURL) {
      return null;
    }
    return <img src={context.logoURL} className={s.logo} alt="" />;
  }

  render() {
    const {
      challenge,
      context
    } = this.props;

    return (
      <Tag className={cn('container', s.signup)}>
        <Row noGutters className={cn('mx-auto', s.card)}>
          <Tag className="form-group">
            {this.Logo()}
            <span className={s.title}>Signup</span>
          </Tag>
          <Tag className="form-group">
            <SignupForm onSubmit={this.onSubmit} />
          </Tag>
          <Tag className="form-group">
            <hr />
          </Tag>
          <Tag className="form-group text-center">
            <a 
            style={{
              color: `${context.secondaryColor || '#000000'} !important`
            }}
            className={s.link} href={`${staticPaths.login}?lc=${challenge || ''}`}>Already a member? Log in</a>
          </Tag>
        </Row>
      </Tag>
    );
  }
}

Signup.propTypes = {
  fetch: PropTypes.func.isRequired,
  csrf: PropTypes.string.isRequired,
  challenge: PropTypes.string.isRequired,
  reCAPTCHASiteKey: PropTypes.string.isRequired,
};

Signup.defaultProps = {
  context: {}
}


export default withStyles(s)(withThemeProvider(Signup));
