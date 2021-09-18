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

export {
  getListUser,
  getOneUser,
  createUser,
  updateUser,
  updateStatusUser,
  deleteUser,
};
