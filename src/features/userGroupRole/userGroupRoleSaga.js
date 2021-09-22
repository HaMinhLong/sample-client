import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './userGroupRoleSlice';
import {
  getListRole,
  getOneRole,
  bulkUpdateRole,
} from '../../api/userGroupRole';

function* getList({ payload: { id, params }, callback }) {
  const { data } = yield call(getListRole, id);

  yield put(query(params));
  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneRole, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* bulkUpdate({ payload: { id, params }, callback }) {
  const { data } = yield call(bulkUpdateRole, id, params);
  if (callback) callback(data);
}

export function* userGroupRoleSaga() {
  yield takeLatest('userGroupRole/fetch', getList);
  yield takeLatest('userGroupRole/getOne', getOne);
  yield takeLatest('userGroupRole/bulkUpdate', bulkUpdate);
}
