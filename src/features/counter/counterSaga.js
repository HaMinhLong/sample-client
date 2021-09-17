import { takeEvery, delay, put, call, takeLatest } from "redux-saga/effects";
import { increment, incrementByAmount } from "./counterSlice";

function* handleIncrementSaga(action) {
  console.log("Waiting 2s");

  yield delay(2000);
  console.log("Waiting done, dispatch action");
  yield put(incrementByAmount(action.payload));
}

export default function* counterSaga() {
  console.log("counter saga");
  // yield takeEvery(increment().type, log);
  // yield takeEvery(increment.toString(), handleIncrementSaga);
  yield takeLatest(increment.toString(), handleIncrementSaga);
}
