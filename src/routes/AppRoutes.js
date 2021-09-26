import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Home from '../pages/Dashboard/Home';
import Menu from '../pages/Menu/Menu';
import UserGroup from '../pages/UserGroup/UserGroup';
import User from '../pages/User/User';
import Config from '../pages/Config/Config';
import UserGroupRole from '../pages/UserGroupRole/UserGroupRole';
import Account from '../pages/Account/Account';
import PageNotFound from '../pages/ErrorsPage/PageNotFound';

const AppRoutes = ({ headerPage }) => {
  const isMobile = window.innerWidth <= 768 ? true : false;
  const intl = useIntl();

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Home isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/menu/:id">
          <Menu isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/user-group/:id">
          <UserGroup isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/user/:id">
          <User isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/config/:id">
          <Config isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/grant-permissions/:id">
          <UserGroupRole
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/account-config">
          <Account isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="*" component={PageNotFound} />
      </Switch>
    </>
  );
};

export default AppRoutes;
