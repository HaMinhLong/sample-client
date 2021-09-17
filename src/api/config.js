import axios from 'axios';
import { stringify } from 'qs';

const getListConfig = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/config?${stringify(params)}`);
const createConfig = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/config`, params);
const updateConfig = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/config/${id}`, params);
const deleteConfig = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/config/${id}`);

export { getListConfig, createConfig, updateConfig, deleteConfig };
