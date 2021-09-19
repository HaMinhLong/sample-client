import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './configSlice';
import {
  getListConfig,
  createConfig,
  updateConfig,
  deleteConfig,
} from '../../api/config';

function* getList({ payload, callback }) {
  const { data } = yield call(getListConfig, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListConfig, payload);
  if (callback) callback(data);
}

function* create({ payload, callback }) {
  const { data } = yield call(createConfig, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateConfig, id, params);
  if (callback) callback(data);
}

function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteConfig, id);
  if (callback) callback(data);
}

export function* configSaga() {
  yield takeLatest('config/fetch', getList);
  yield takeLatest('config/add', create);
  yield takeLatest('config/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('config/update', updateRecord);
  yield takeLatest('config/delete', deleteRecord);
}
