import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';
import Helmet from 'react-helmet';
import theme from '../../../assets/styles/theme.scss';
import s from './AuthLayout.scss';

import Theme, { themeValue } from '../../Theme/Theme';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';

class AuthLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <ErrorBoundary>
        <Theme.Provider value={themeValue.light}>
          {this.props.children}
        </Theme.Provider>
      </ErrorBoundary>
    );
  }
}

export default withStyles(theme, s)(AuthLayout);
