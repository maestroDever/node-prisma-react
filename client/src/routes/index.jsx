import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import { Query, compose, withApollo } from "react-apollo";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminRoutes from "./admin";
import UserRoutes from "./user";

import { ProgressSpinner } from "../components";
import { AUTH_TOKEN, persistor } from "../config";
import { MeQuery } from "../queries";

import ScrollToTop from "./ScrollToTop";
import "./styles.scss";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem(AUTH_TOKEN);
  if (!isAuthenticated)
    return (
      <Redirect to={{ pathname: "/login", state: { from: rest.location } }} />
    );

  return (
    <Query query={MeQuery}>
      {({ loading, error, data }) => {
        if (loading) return <ProgressSpinner />;
        return (
          <Route
            {...rest}
            render={props => {
              if (data.me.isAdmin) {
                return props.location.pathname !== "/admin" ? (
                  <Redirect to="/admin" />
                ) : (
                  <Component {...props} />
                );
              } else {
                if (props.location.pathname === "/admin")
                  return <Redirect to="/app/prevote" />;
                return Component ? (
                  <Component {...props} />
                ) : (
                  <Redirect to="/app/prevote" />
                );
              }
            }}
          />
        );
      }}
    </Query>
  );
};

const Routes = ({ client, history }) => {
  const logoutHandler = () => {
    persistor.pause();
    persistor.purge().then(() => {
      localStorage.removeItem(AUTH_TOKEN);
      persistor.resume();
      client.resetStore();
      history.push("/");
    });
  };
  return (
    <div className="layout-wrapper">
      <div className="layout-topbar">
        <div className="logo">
          <span>Indecision2020</span>
        </div>
        {localStorage.getItem(AUTH_TOKEN) && (
          <div className="topbar-menu">
            <div className="menu-button" onClick={logoutHandler}>
              Log out
            </div>
          </div>
        )}
      </div>
      <div id="layout-content">
        <PrivateRoute exact path="/" />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/app" component={UserRoutes} />
        <PrivateRoute path="/admin" component={AdminRoutes} />
      </div>
    </div>
  );
};

const AnimationRoutes = compose(
  withApollo,
  withRouter
)(Routes);

const MainRoute = () => {
  return (
    <Router>
      <ScrollToTop>
        <AnimationRoutes />
      </ScrollToTop>
    </Router>
  );
};

export default MainRoute;
