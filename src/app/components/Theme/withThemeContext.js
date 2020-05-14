import React from 'react';

import { ThemeContext } from './Theme';

export default function withAppContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ThemeContext.Consumer>
        {state => <Component {...props} context={state} />}
      </ThemeContext.Consumer>
    );
  };
}
