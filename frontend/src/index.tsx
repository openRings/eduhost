/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { Notifications } from "./features/Notifications";
import { Section } from "./shared/Section";
import z from "zod";

import "./tailwind.css";
import "solid-devtools";

import Buttons from "./pages/buttons";
import Inputs from "./pages/inputs";
import Selects from "./pages/selects";
import Blocks from "./pages/blocks";
import Signin from "./pages/signin";
import Form from "./pages/form";

const App = () => {
  z.config({
    customError: (issue) => {
      if (issue.code === "invalid_type") return "Обязательное поле";
      if (issue.code === "too_small")
        return `Минимальная длина: ${issue.minimum}`;
      if (issue.code === "too_big")
        return `Максимальная длина: ${issue.maximum}`;
      if (issue.code === "invalid_format" && issue.format === "lowercase")
        return `Только нижний регистр`;

      return undefined;
    },
  });

  return (
    <div class="flex min-h-screen gap-0.5">
      <Section class="h-auto grow" />
      <div class="flex w-300 flex-col gap-0.5">
        <Router>
          <Route path="/buttons" component={Buttons} />
          <Route path="/inputs" component={Inputs} />
          <Route path="/selects" component={Selects} />
          <Route path="/blocks" component={Blocks} />
          <Route path="/form" component={Form} />
          <Route path="/signin" component={Signin} />
        </Router>
      </div>
      <Section class="h-auto grow" />
      <Notifications />
    </div>
  );
};
render(App, document.body);
