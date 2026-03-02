/* @refresh reload */
import { render, Show } from "solid-js/web";
import { Router, Route, useLocation } from "@solidjs/router";
import { Notifications } from "./features/Notifications";
import { Section } from "./shared/Section";
import { Header } from "./components/Header";
import z from "zod";

import "./tailwind.css";
import "solid-devtools";

import Buttons from "./pages/buttons";
import Inputs from "./pages/inputs";
import Selects from "./pages/selects";
import Blocks from "./pages/blocks";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Index from "./pages/index";
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

  const layout = (props: any) => {
    const location = useLocation();

    return (
      <>
        <Show when={!location.pathname.startsWith("/sign")}>
          <Header />
        </Show>
        <Notifications />
        <div class="flex min-h-screen gap-0.5">
          <Section class="h-auto grow p-0! max-md:hidden" />
          <div class="flex w-full max-w-[1264px] flex-col gap-0.5">
            {props.children}
          </div>
          <Section class="h-auto grow p-0! max-md:hidden" />
        </div>
      </>
    );
  };

  return (
    <Router root={layout}>
      <Route path="/buttons" component={Buttons} />
      <Route path="/inputs" component={Inputs} />
      <Route path="/selects" component={Selects} />
      <Route path="/blocks" component={Blocks} />
      <Route path="/form" component={Form} />
      <Route path="/" component={Index} />
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
    </Router>
  );
};

render(App, document.body);
