import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Image.css';

function Image({ src, alt }) {
  return (
    <img src={src} alt={alt} />
  );
}

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

Image.defaultProps = {
  src: '#',
  alt: '#',
};

export default withStyles(s)(Image);
