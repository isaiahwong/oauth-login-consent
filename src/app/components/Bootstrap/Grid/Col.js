/* eslint-disable css-modules/no-undef-class */
/* eslint-disable react/require-default-props */
/**
 * The MIT License (MIT)
 * Copyright (c) 2016-Present Eddy Hernandez, Chris Burrell, Evan Sharp
 * https://github.com/reactstrap/reactstrap
 */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';
import { isObject } from 'lodash';

import { deprecated } from './util';
import g from './grid.css';

const colWidths = ['xs', 'sm', 'md', 'lg', 'xl'];
const stringOrNumberProp = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

const columnProps = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.number,
  PropTypes.string,
  PropTypes.shape({
    size: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
    push: deprecated(stringOrNumberProp, 'Please use the prop "order"'),
    pull: deprecated(stringOrNumberProp, 'Please use the prop "order"'),
    order: stringOrNumberProp,
    offset: stringOrNumberProp,
  }),
]);

const getColumnSizeClass = (isXs, colWidth, colSize) => {
  if (colSize === true || colSize === '') {
    return isXs ? g.col : g[`col-${colWidth}`];
  }
  // eslint-disable-next-line no-else-return
  else if (colSize === 'auto') {
    return isXs ? g['col-auto'] : g[`col-${colWidth}-auto`];
  }

  return isXs ? g[`col-${colSize}`] : g[`col-${colWidth}-${colSize}`];
};

const Col = (props) => {
  const {
    className,
    tag: Tag,
    ...attributes
  } = props;
  const colClasses = [];

  colWidths.forEach((colWidth, i) => {
    const columnProp = props[colWidth];

    delete attributes[colWidth];

    if (!columnProp && columnProp !== '') {
      return;
    }

    const isXs = !i;

    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

      colClasses.push(cn({
        [colClass]: columnProp.size || columnProp.size === '',
        [g[`order${colSizeInterfix}${columnProp.order}`]]: columnProp.order || columnProp.order === 0,
        [g[`offset${colSizeInterfix}${columnProp.offset}`]]: columnProp.offset || columnProp.offset === 0
      }));
    }
    else {
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });

  if (!colClasses.length) {
    colClasses.push(g.col);
  }

  const classes = cn(
    className,
    colClasses,
  );

  return (
    <Tag {...attributes} className={classes} />
  );
};

Col.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  xs: columnProps,
  sm: columnProps,
  md: columnProps,
  lg: columnProps,
  xl: columnProps,
  className: PropTypes.string,
};

Col.defaultProps = {
  tag: 'div',
};


export default withStyles(g)(Col);
