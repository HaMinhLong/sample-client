import axios from 'axios';
import { stringify } from 'qs';

const getListRole = (id, params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/userGroupRole/auth_role/${id}?${stringify(
      params
    )}`
  );
const getListAuthRole = (params) =>
  axios({
    method: 'get',
    url: `${process.env.REACT_APP_SERVER}/userGroupRole/auth_routes`,
    headers: { 'x-access-token': params },
  });
const getOneRole = (id, params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/userGroupRole/${id}?${stringify(params)}`
  );
const bulkUpdateRole = (id, params) =>
  axios.post(
    `${process.env.REACT_APP_SERVER}/userGroupRole/bulk/update/${id}`,
    params
  );

export { getListRole, getListAuthRole, getOneRole, bulkUpdateRole };
