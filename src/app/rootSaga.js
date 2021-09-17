import { all } from 'redux-saga/effects';
import { userGroupSaga } from '../features/userGroup/userGroupSaga';
import { userSaga } from '../features/user/userSaga';
import { menuSaga } from '../features/menu/menuSaga';
import { configSaga } from '../features/config/configSaga';

export default function* rootSaga() {
  yield all([userGroupSaga(), userSaga(), menuSaga(), configSaga()]);
}
