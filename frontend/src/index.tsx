/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { Section } from "./shared/Section";

import "./tailwind.css";
import "solid-devtools";

import Buttons from "./pages/buttons";
import Inputs from "./pages/inputs";
import Selects from "./pages/selects";
import Blocks from "./pages/blocks";

const App = () => (
  <div class="flex min-h-screen gap-0.5">
    <Section class="h-auto grow" />
    <div class="flex w-300 flex-col gap-0.5">
      <Router>
        <Route path="/buttons" component={Buttons} />
        <Route path="/inputs" component={Inputs} />
        <Route path="/selects" component={Selects} />
        <Route path="/blocks" component={Blocks} />
      </Router>
    </div>
    <Section class="h-auto grow" />
  </div>
);

render(App, document.body);
