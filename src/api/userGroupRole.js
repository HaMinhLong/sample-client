import axios from 'axios';
import { stringify } from 'qs';

const getListRole = (id, params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/userGroupRole/auth_role/${id}?${stringify(
      params
    )}`
  );
const getOneRole = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/userGroupRole/${id}`);
const bulkUpdateRole = (id, params) =>
  axios.post(
    `${process.env.REACT_APP_SERVER}/userGroupRole/bulk/update/${id}`,
    params
  );

export { getListRole, getOneRole, bulkUpdateRole };
