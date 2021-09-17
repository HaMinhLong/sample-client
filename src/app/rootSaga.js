import { all } from 'redux-saga/effects';
import counterSaga from '../features/counter/counterSaga';

export default function* rootSaga() {
  yield all([counterSaga()]);
}
