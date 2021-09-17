import userGroupReducer from '../features/userGroup/userGroupSlice';
import userReducer from '../features/user/userSlice';
import menuReducer from '../features/menu/menuSlice';
import configReducer from '../features/config/configSlice';

export const rootReducer = {
  userGroup: userGroupReducer,
  user: userReducer,
  menu: menuReducer,
  config: configReducer,
};
