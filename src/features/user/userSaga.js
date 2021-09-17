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
  yield takeLatest('User/fetch', getList);
  yield takeLatest(info().type, getOne);
  yield takeLatest('User/add', create);
  yield takeLatest('User/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('User/update', updateRecord);
  yield takeLatest('User/updateStatus', updateStatus);
  yield takeLatest('User/delete', deleteRecord);
}
