import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from '../../../common/i18n';

class Translation extends Component {
  static propTypes = {
    Child: PropTypes.func.isRequired,
    defaultLocale: PropTypes.string
  }

  static defaultProps = {
    defaultLocale: 'en'
  }

  constructor(props) {
    super(props);
    this.t = this.t.bind(this);
  }

  t(string) {
    return i18n.t(string, this.props.defaultLocale);
  }

  render() {
    const { Child } = this.props;
    return (
      <Child {...this.props} t={this.t} />
    );
  }
}

function mapStateToProps(state) {
  return {
    defaultLocale: state.localization.defaultLocale
  };
}

// eslint-disable-next-line no-class-assign
Translation = connect(mapStateToProps)(Translation);

export function withTranslation(Child) {
  return props => <Translation {...props} Child={Child} />;
}


export default Translation;
