import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Tag } from '../../components/Bootstrap/Grid';
import s from './NotFound.scss';

class NotFound extends React.Component {
  render() {
    return (
      <Tag className="container">
        <h1>Not Found</h1>
        <p>Sorry, the page you were trying to view does not exist.</p>
      </Tag>
    );
  }
}

export { NotFound as NotFoundWithoutStyle };
export default withStyles(s)(NotFound);
