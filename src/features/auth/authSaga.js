import { put, call, takeLatest } from 'redux-saga/effects';
import { save } from './authSlice';
import { verifyTokenUser, signInUser } from '../../api/auth';

function* verifyToken({ payload, callback }) {
  const { data } = yield call(verifyTokenUser, payload);

  if (data && data.success) {
    yield put(save(payload));
  }
  if (callback) callback(data);
}
function* signIn({ payload, callback }) {
  const { data } = yield call(signInUser, payload);
  if (callback) callback(data);
}
export function* authSaga() {
  yield takeLatest('auth/verifyToken', verifyToken);
  yield takeLatest('auth/signIn', signIn);
}
