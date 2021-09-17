import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './userGroupSlice';
import {
  getListUserGroup,
  getOneUserGroup,
  createUserGroup,
  updateUserGroup,
  updateStatusUserGroup,
  deleteUserGroup,
} from '../../api/userGroup';

function* getList({ payload, callback }) {
  const { data } = yield call(getListUserGroup, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListUserGroup, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneUserGroup, id);
  if (callback) callback(data);
  if (data) {
    yield put(info(data.results.list || {}));
  }
}
function* create({ payload, callback }) {
  const { data } = yield call(createUserGroup, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateUserGroup, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusUserGroup, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteUserGroup, id);
  if (callback) callback(data);
}

export function* userGroupSaga() {
  yield takeLatest('userGroup/fetch', getList);
  yield takeLatest(info().type, getOne);
  yield takeLatest('userGroup/add', create);
  yield takeLatest('userGroup/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('userGroup/update', updateRecord);
  yield takeLatest('userGroup/updateStatus', updateStatus);
  yield takeLatest('userGroup/delete', deleteRecord);
}
