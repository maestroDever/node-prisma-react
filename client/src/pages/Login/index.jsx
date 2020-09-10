import React, { useState } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { LoginMutation } from "../../queries/auth";
import { AUTH_TOKEN } from "../../config";

import "./Login.style.scss";

function Login({ location }) {
  const [authInfo, setAuthInfo] = useState({ email: "", password: "" });
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const loginSuccess = data => {
    const { token, isAdmin } = data.login;
    localStorage.setItem(AUTH_TOKEN, token);
    setIsAdmin(isAdmin);
    setRedirectToReferer(true);
  };

  const handleInputChange = e => {
    setAuthInfo({
      ...authInfo,
      [e.target.name]: e.target.value
    });
  };

  if (redirectToReferer) {
    const { from } = {
      from: { pathname: isAdmin ? "/admin" : "/app" }
    };
    return <Redirect to={from} />;
  }

  return (
    <div className="p-grid p-justify-center p-align-center login">
      <div className="p-col-10 p-md-8">
        <Card title="Login">
          <Mutation
            mutation={LoginMutation}
            variables={authInfo}
            onCompleted={loginSuccess}
          >
            {mutation => (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  mutation();
                }}
              >
                <div className="p-grid p-justify-center">
                  <div className="p-col-8 p-fluid">
                    <span className="p-float-label">
                      <InputText
                        id="email"
                        name="email"
                        value={authInfo.email}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="email">Email</label>
                    </span>
                  </div>
                  <div className="p-col-8 p-fluid">
                    <span className="p-float-label">
                      <Password
                        id="password"
                        name="password"
                        feedback={false}
                        value={authInfo.password}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="password">Password</label>
                    </span>
                  </div>
                  <div className="p-grid p-col-8 p-justify-end">
                    <Button
                      className="p-button-raised"
                      label="Login"
                      type="submit"
                    />
                  </div>
                </div>
              </form>
            )}
          </Mutation>
        </Card>
      </div>
    </div>
  );
}

Login.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.object
  })
};

export default Login;
