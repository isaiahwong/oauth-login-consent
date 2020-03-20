import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { showNavigation } from '../../actions/controls';
import history from '../../history';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    showNavigation: PropTypes.func,
    desktopMode: PropTypes.bool,
  };

  static defaultProps = {
    onClick: null,
  };

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    history.push(this.props.to);
    if (!this.props.desktopMode) {
      this.props.showNavigation(false);
    }
  };

  render() {
    const { to, children, ...props } = this.props;
    return (
      <a href={to} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

const mapDispatchToProps = {
  showNavigation,
};

const mapStateToProps = state => ({
  desktopMode: state.controls.desktopMode,
});

export default connect(mapStateToProps, mapDispatchToProps)(Link);
