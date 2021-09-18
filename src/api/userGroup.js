import axios from 'axios';
import { stringify } from 'qs';

const getListUserGroup = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/userGroup?${stringify(params)}`);
const getOneUserGroup = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/userGroup/${id}`);
const createUserGroup = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/userGroup`, params);
const updateUserGroup = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/userGroup/${id}`, params);
const updateStatusUserGroup = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/userGroup/updateStatus/${id}`,
    params
  );
const deleteUserGroup = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/userGroup/${id}`);

export {
  getListUserGroup,
  getOneUserGroup,
  createUserGroup,
  updateUserGroup,
  updateStatusUserGroup,
  deleteUserGroup,
};
