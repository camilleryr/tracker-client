import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Splash from "./Splash";
import App from "./App";
import NotFound from "./NotFound";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/tracker-client/" component={Splash} />
      <Route path="/tracker-client/visualize" component={App} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
