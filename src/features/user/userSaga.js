import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './userSlice';
import {
  getListUser,
  getOneUser,
  createUser,
  updateUser,
  updateStatusUser,
  deleteUser,
} from '../../api/user';

function* getList({ payload, callback }) {
  const { data } = yield call(getListUser, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListUser, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneUser, id);
  if (callback) callback(data);
  if (data) {
    yield put(info(data.results.list || {}));
  }
}
function* create({ payload, callback }) {
  const { data } = yield call(createUser, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateUser, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusUser, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteUser, id);
  if (callback) callback(data);
}

export function* userSaga() {
  yield takeLatest('user/fetch', getList);
  yield takeLatest('user/getOne', getOne);
  yield takeLatest('user/add', create);
  yield takeLatest('user/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('user/update', updateRecord);
  yield takeLatest('user/updateStatus', updateStatus);
  yield takeLatest('user/delete', deleteRecord);
}
