import axios from 'axios';
import { stringify } from 'qs';

const getListMenu = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/menu?${stringify(params)}`);
const getOneMenu = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/menu/${id}`);
const createMenu = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/menu`, params);
const updateMenu = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/menu/${id}`, params);
const updateStatusMenu = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/menu/updateStatus/${id}`, params);
const deleteMenu = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/menu/${id}`);

export {
  getListMenu,
  getOneMenu,
  createMenu,
  updateMenu,
  updateStatusMenu,
  deleteMenu,
};
