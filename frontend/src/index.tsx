/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./tailwind.css";
import "solid-devtools";

import Buttons from "./pages/buttons";
import Inputs from "./pages/inputs";

const App = () => (
  <Router>
    <Route path="/buttons" component={Buttons} />
    <Route path="/inputs" component={Inputs} />
  </Router>
);

render(App, document.body);
