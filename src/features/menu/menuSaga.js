import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './menuSlice';
import {
  getListMenu,
  getOneMenu,
  createMenu,
  updateMenu,
  updateStatusMenu,
  deleteMenu,
} from '../../api/menu';

function* getList({ payload, callback }) {
  const { data } = yield call(getListMenu, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListMenu, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneMenu, id);
  if (callback) callback(data);
  if (data) {
    yield put(info(data.results.list || {}));
  }
}
function* create({ payload, callback }) {
  const { data } = yield call(createMenu, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateMenu, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusMenu, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteMenu, id);
  if (callback) callback(data);
}

export function* menuSaga() {
  yield takeLatest('Menu/fetch', getList);
  yield takeLatest(info().type, getOne);
  yield takeLatest('Menu/add', create);
  yield takeLatest('Menu/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('Menu/update', updateRecord);
  yield takeLatest('Menu/updateStatus', updateStatus);
  yield takeLatest('Menu/delete', deleteRecord);
}