/* eslint-disable import/prefer-default-export */
/* eslint-disable flowtype/no-types-missing-file-annotation */
const API_AUTH = '/api/v1/auth';

export const EndPoints = {
  API_AUTH,
  GET_USER: `${API_AUTH}/user`,
  SIGNUP: `${API_AUTH}/signup`,
};

class User {
}

export default User;
