/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./tailwind.css";
import "solid-devtools";

import Buttons from "./pages/buttons";
import Inputs from "./pages/inputs";
import Selects from "./pages/selects";
import Blocks from "./pages/blocks";

const App = () => (
  <Router>
    <Route path="/buttons" component={Buttons} />
    <Route path="/inputs" component={Inputs} />
    <Route path="/selects" component={Selects} />
    <Route path="/blocks" component={Blocks} />
  </Router>
);

render(App, document.body);
