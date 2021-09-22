import React from 'react';
import { Route } from 'react-router-dom';
import Home from '../pages/Dashboard/Home';
import Menu from '../pages/Menu/Menu';
import UserGroup from '../pages/UserGroup/UserGroup';
import User from '../pages/User/User';
import Config from '../pages/Config/Config';
import UserGroupRole from '../pages/UserGroupRole/UserGroupRole';
import { useIntl } from 'react-intl';

const AppRoutes = () => {
  const isMobile = window.innerWidth <= 768 ? true : false;
  const intl = useIntl();

  return (
    <>
      <Route exact path="/">
        <Home isMobile={isMobile} intl={intl} />
      </Route>
      <Route path="/menu/:id">
        <Menu isMobile={isMobile} intl={intl} />
      </Route>
      <Route path="/user-group/:id">
        <UserGroup isMobile={isMobile} intl={intl} />
      </Route>
      <Route path="/user/:id">
        <User isMobile={isMobile} intl={intl} />
      </Route>
      <Route path="/config/:id">
        <Config isMobile={isMobile} intl={intl} />
      </Route>
      <Route path="/grant-permissions/:id">
        <UserGroupRole isMobile={isMobile} intl={intl} />
      </Route>
    </>
  );
};

export default AppRoutes;
