import axios from 'axios';
import { stringify } from 'qs';

const getListUser = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/user?${stringify(params)}`);
const getOneUser = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/user/${id}`);
const createUser = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/user`, params);
const updateUser = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/user/${id}`, params);
const updateStatusUser = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/user/updateStatus/${id}`, params);
const deleteUser = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/user/${id}`);
const currentUser = (params) =>
  axios({
    method: 'post',
    url: `${process.env.REACT_APP_SERVER}/user/currentUser`,
    headers: { 'x-access-token': params },
  });
const changePasswordUserLogin = (token, params) =>
  axios({
    method: 'post',
    url: `${process.env.REACT_APP_SERVER}/user/changePasswordLogin`,
    headers: { 'x-access-token': token },
    data: params,
  });

const changePasswordUserNotLogin = (params) =>
  axios.post(
    `${process.env.REACT_APP_SERVER}/user/changePasswordNotLogin`,
    params
  );
const forgotPasswordUser = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/user/forgotPassword`, params);

export {
  getListUser,
  getOneUser,
  createUser,
  updateUser,
  updateStatusUser,
  deleteUser,
  currentUser,
  changePasswordUserLogin,
  changePasswordUserNotLogin,
  forgotPasswordUser,
};
