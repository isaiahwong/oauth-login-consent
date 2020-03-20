/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';

import Logo from '../Navigation/logo.svg';
import s from './NavigationHeader.scss';

class NavigationHeader extends React.Component {
  static propTypes = {
    showNav: PropTypes.bool,
    desktopMode: PropTypes.bool,
    showNavigation: PropTypes.func,
    contentClass: PropTypes.string.isRequired,
  };

  static defaultProps = {
    showNav: true,
    desktopMode: true,
    // eslint-disable-next-line no-console
    showNavigation: () => console.log('please provide toggle fn'),
  }

  constructor(props) {
    super(props);

    this.headerShouldStick = this.headerShouldStick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.headerShouldStick);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.headerShouldStick);
  }

  // eslint-disable-next-line class-methods-use-this
  headerShouldStick() {
    const header = document.getElementsByClassName(s['navigation-header'])[0];
    const content = document.getElementsByClassName(this.props.contentClass)[0];

    const sticky = header.offsetTop;
    if (window.pageYOffset > sticky) {
      header.classList.add(s.sticky);
      content.classList.add(s['sticky-smooth']);
    }
    else {
      header.classList.remove(s.sticky);
      content.classList.remove(s['sticky-smooth']);
    }
  }

  Toggle() {
    const { showNav, showNavigation } = this.props;
    return (
      <div
        className={cn(s.hamburger, s['hamburger--spring'], showNav && s['is-active'])}
        onClick={() => showNavigation(!showNav)}
      >
        <span className={cn(s['hamburger-box'])}>
          <span className={cn(s['hamburger-inner'])} />
        </span>
      </div>
    );
  }

  Logo() {
    const { desktopMode } = this.props;

    if (desktopMode) {
      return null;
    }

    return (
      <a href="/" className={s['logo-wrapper']}>
        <img src={Logo} className={s.logo} alt="isaiahwong" />
      </a>
    );
  }

  render() {
    return (
      <nav className={s['navigation-header']}>
        {this.Logo()}
        {this.Toggle()}
      </nav>
    );
  }
}

export default withStyles(s)(NavigationHeader);
