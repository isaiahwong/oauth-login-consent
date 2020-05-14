import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const ThemeContext = React.createContext('theme');

// export function useForceUpdate() {
//   const [value, set] = useState(true); // boolean state
//   return () => set(value => !value); // toggle the state to force render
// }

class ThemeProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.shape({
      primaryColor: PropTypes.string,
      logoURL: PropTypes.string,
    }).isRequired,
  };

  static defaultPropTypes = {
    theme: {
      primaryColor: '#1820d3',
      logoURL: '',
    },
  }

  render() {
    const { children } = this.props;
    return (
      <ThemeContext.Provider value={this.props.theme}>
        {children}
      </ThemeContext.Provider>
    );
  }
}

function mapStateToProps(state) {
  return { theme: state.theme };
}

export default connect(mapStateToProps)(ThemeProvider);
