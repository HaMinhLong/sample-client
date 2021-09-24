import axios from 'axios';
import { stringify } from 'qs';

const verifyTokenUser = (params) =>
  axios({
    method: 'post',
    url: `${process.env.REACT_APP_SERVER}/auth/verifyToken`,
    headers: { 'x-access-token': params },
  });
const signInUser = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/auth/signIn`, params);

export { verifyTokenUser, signInUser };
