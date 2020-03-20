/* eslint-disable css-modules/no-unused-class */
/* eslint-disable no-shadow */
/* eslint-disable no-mixed-operators */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';
import Helmet from 'react-helmet';

// external-global styles must be imported in your JS.
import theme from '../../../assets/styles/theme.scss';
import s from './SideBarLayout.scss';

import { showNavigation, toggleDesktopMode } from '../../../actions/controls';

import Theme, { themeValue } from '../../Theme/Theme';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import NavigationHeader from '../../NavigationHeader/NavigationHeader';
import Navigation from '../../Navigation/Navigation';
import Footer from '../../Footer/Footer';
import BlackOverlay from '../../Overlays/BlackOverlay';

class SideBarLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    showNav: PropTypes.bool.isRequired,
    desktopMode: PropTypes.bool.isRequired,
    userAgentMobile: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    showNavigation: PropTypes.func.isRequired,
    toggleDesktopMode: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    if (process.env.BROWSER) {
      this.updateDimensions();
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', null);
  }

  updateDimensions() {
    const { userAgentMobile, toggleDesktopMode } = this.props;

    if (window.outerWidth <= 320) {
      toggleDesktopMode(true);
    }
    else if (window.outerWidth <= 992) {
      // mobile requesting desktop site
      toggleDesktopMode(!userAgentMobile);
    }
    else {
      toggleDesktopMode(true);
    }
  }

  hideNavigation() {
    this.props.showNavigation(false);
  }

  Head() {
    return (
      <Helmet>
        {this.props.desktopMode && process.env.BROWSER ? ( // enable viewport only for screen size below 400
          <meta name="viewport" content="width=1200" />
        ) : (
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        )}
      </Helmet>
    );
  }

  render() {
    const {
      showNav, showNavigation, pathname, desktopMode
    } = this.props;

    return (
      <ErrorBoundary>
        <Theme.Provider value={themeValue.light}>
          {this.Head()}
          <div className={s.layout}>
            <Navigation currentPath={pathname} showNav={showNav} />
            <div className={cn(s.main, { [s.slide]: showNav })}>
              <NavigationHeader
                showNavigation={showNavigation}
                desktopMode={desktopMode}
                showNav={showNav}
                contentClass={s.content}
              />
              <div className={s.content}>{this.props.children}</div>
            </div>
          </div>
          <Footer />
          {(showNav && !desktopMode && (
            <BlackOverlay onClick={() => this.hideNavigation()} />
          ))
            || null}
        </Theme.Provider>
      </ErrorBoundary>
    );
  }
}

function mapStateToProps(state) {
  const { showNav, desktopMode, userAgentMobile } = state.controls;

  return {
    showNav,
    desktopMode,
    userAgentMobile,
    pathname: state.history.pathname || '/',
  };
}

const mapDispatchToProps = {
  showNavigation,
  toggleDesktopMode,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(theme, s)(SideBarLayout));
