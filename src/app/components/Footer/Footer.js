import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Footer.css';

class Footer extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <span className={s.text}>Isaiah Wong</span>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Footer);
