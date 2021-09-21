import axios from 'axios';
import { stringify } from 'qs';

const getListMenu = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/menu/parent-child?${stringify(params)}`
  );
const detailMenusTree = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/menu/parent-child-one?${stringify(params)}`
  );
const getOneMenu = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/menu/${id}`);
const createMenu = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/menu`, params);
const updateMenu = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/menu/${id}`, params);

const updateOrdersMenu = (params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/menu/update/orders`, params);
const updateStatusListMenu = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/menu/updateStatusList/${id}`,
    params
  );
const updateStatusMenu = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/menu/updateStatus/${id}`, params);
const deleteMenu = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/menu/${id}`);

export {
  getListMenu,
  detailMenusTree,
  getOneMenu,
  createMenu,
  updateMenu,
  updateOrdersMenu,
  updateStatusMenu,
  updateStatusListMenu,
  deleteMenu,
};
