import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

import Theme from '../Theme/Theme';
import s from './Card.scss';
import Image from '../Bootstrap/Image/Image';

class Card extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }).isRequired,
  }

  render() {
    const { name, image } = this.props.data;

    // const style = {
    //   backgroundImage: `url(${image})`,
    // }

    return (
      <div className={s.cardwrapper}>
        <div className={s.card}>
          <div className={s['image-wrap']}>
            <Image src={image} alt={name} />
          </div>
          <div className={s.title}>
            {name}
          </div>
        </div>
      </div>
    );
  }
}

Card.contextType = Theme;

export default withStyles(s)(Card);
