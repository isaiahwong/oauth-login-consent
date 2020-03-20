/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Overlay.css';

function BlackOverlay({ onClick }) {
  return (
    <div
      onClick={onClick}
      className={s.blackOverlay}
    />
  );
}

BlackOverlay.propTypes = {
  onClick: PropTypes.func,
};

BlackOverlay.defaultProps = {
  onClick: () => null,
};

export default withStyles(s)(BlackOverlay);
