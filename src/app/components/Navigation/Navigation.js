/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import cn from 'classnames';

import { routePaths } from '../../routes';
import history from '../../history';
// eslint-disable-next-line css-modules/no-unused-class
import s from './Navigation.scss';
import Link from '../Link';
import ListItem from './ListItem';
import Logo from './logo.svg';

class Navigation extends React.Component {
  static propTypes = {
    showNav: PropTypes.bool,
    currentPath: PropTypes.string,
  };

  static listType = {
    dropdown: 'dropdown',
    item: 'item',
  };

  static defaultProps = {
    showNav: true,
    currentPath: '/',
  }

  get list() {
    return [
      {
        ...routePaths.projects,
        type: Navigation.listType.item,
      },
      {
        path: `${routePaths.auth.path}${routePaths.auth.login.path}`,
        title: routePaths.auth.login.title,
        type: Navigation.listType.item,
      },
    ];
  }

  RenderList() {
    const currentPath = (history && history.location.pathname) || this.props.currentPath;
    return this.list.map(({ title, path, type }) => {
      switch (type) {
        case Navigation.listType.item:
          return (
            <ListItem
              key={title}
              title={title}
              path={path}
              currentPath={currentPath}
            />
          );
        default:
          return null;
      }
    });
  }

  render() {
    const { showNav } = this.props;
    return (
      <nav className={cn(s.navigation, { [s.hide]: !showNav })}>
        <ul className={cn(['list-unstyled', s.components])}>
          <li className={s['logo-wrapper']}>
            <Link to="/">
              <img src={Logo} className={s.logo} alt="" />
            </Link>
          </li>
          {this.RenderList()}
        </ul>
      </nav>
    );
  }
}

export default withStyles(s)(Navigation);
