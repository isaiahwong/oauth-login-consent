/* eslint-disable css-modules/no-undef-class */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';

import g from './grid.css';

function Row(props) {
  const {
    className, noGutters, tag: Tag, ...attributes
  } = props;

  const classArray = typeof className === 'string' && className.split(' ').map(c => g[c] || c);

  const classes = cn(classArray, noGutters ? g['no-gutters'] : null, g.row);

  return <Tag {...attributes} className={classes} />;
}

Row.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  noGutters: PropTypes.bool,
  className: PropTypes.string,
};

Row.defaultProps = {
  tag: 'div',
  noGutters: false,
  className: null,
};

export default withStyles(g)(Row);
