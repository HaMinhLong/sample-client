import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import { rootReducer } from './rootReducer';

let sagaMiddleware = createSagaMiddleware();
const middleware = [
  ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
  sagaMiddleware,
];

const store = configureStore({
  reducer: rootReducer,
  middleware,
});
sagaMiddleware.run(rootSaga);

export default store;
