// import { ActionTypes } from '../actions/config';

const initialState = {
  primaryColor: '#101BCC',
  logoURL: '',
  secondaryColor: '#00000'
};

export default function theme(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
