import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';
import pathToRegexp from 'path-to-regexp';

import Link from '../Link';
import s from './ListItem.css';

function ListItem(props) {
  const {
    key,
    title,
    path,
    currentPath,
  } = props;
  const regexp = pathToRegexp(currentPath);

  return (
    <li
      key={key}
      className={cn(s.heading, s['list-item'], { [s.active]: regexp.exec(path) })}
    >
      <Link to={path}>
        {title}
      </Link>
    </li>
  );
}

ListItem.propTypes = {
  key: PropTypes.string,
  title: PropTypes.string,
  path: PropTypes.string,
  currentPath: PropTypes.string,
};

ListItem.defaultProps = {
  key: 'Title',
  title: 'Title',
  path: '#',
  currentPath: '/',
};

export default withStyles(s)(ListItem);
