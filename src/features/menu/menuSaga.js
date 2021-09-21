import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './menuSlice';
import {
  getListMenu,
  detailMenusTree,
  getOneMenu,
  createMenu,
  updateMenu,
  updateOrdersMenu,
  updateStatusListMenu,
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
function* detailTree({ payload, callback }) {
  const query = {
    filter: JSON.stringify(payload),
  };
  const { data } = yield call(detailMenusTree, query);
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
function* updateOrders({ payload, callback }) {
  const { data } = yield call(updateOrdersMenu, payload);
  if (callback) callback(data);
}
function* updateStatusList({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusListMenu, id, params);
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
  yield takeLatest('menu/fetch', getList);
  yield takeLatest('menu/detailTree', detailTree);
  yield takeLatest('menu/getOne', getOne);
  yield takeLatest('menu/add', create);
  yield takeLatest('menu/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('menu/update', updateRecord);
  yield takeLatest('menu/updateOrder', updateOrders);
  yield takeLatest('menu/updateStatusList', updateStatusList);
  yield takeLatest('menu/updateStatus', updateStatus);
  yield takeLatest('menu/delete', deleteRecord);
}
