/* eslint-disable no-underscore-dangle */
/* eslint-disable css-modules/no-undef-class */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';

import g from './grid.css';

function _Tag(props) {
  const {
    className,
    tag: Tag,
    ...attributes
  } = props;

  const classArray = typeof className === 'string' && className.split(' ').map(c => g[c] || c);

  const classes = cn(
    classArray,
  );

  return (
    <Tag {...attributes} className={classes} />
  );
}

_Tag.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  className: PropTypes.string,
};

_Tag.defaultProps = {
  tag: 'div',
  className: null,
};

export default withStyles(g)(_Tag);
