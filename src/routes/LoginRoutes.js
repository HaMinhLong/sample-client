import React from 'react';
import { Route } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Login from '../pages/Login/Login';

const LoginRoutes = () => {
  const isMobile = window.innerWidth <= 768 ? true : false;
  const intl = useIntl();

  return (
    <>
      <Route exact path="/">
        <Login isMobile={isMobile} intl={intl} />
      </Route>
    </>
  );
};

export default LoginRoutes;
