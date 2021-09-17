import React from "react";
import { Route } from "react-router-dom";
import Home from "../pages/Dashboard/Home";
import Menu from "../pages/Menu/Menu";
import UserGroup from "../pages/UserGroup/UserGroup";
import User from "../pages/User/User";
import Config from "../pages/Config/Config";

const AppRoutes = () => {
  return (
    <>
      <Route exact path="/" component={Home} />
      <Route path="/menu/:id" component={Menu} />
      <Route path="/user-group/:id" component={UserGroup} />
      <Route path="/user/:id" component={User} />
      <Route path="/config/:id" component={Config} />
    </>
  );
};

export default AppRoutes;
