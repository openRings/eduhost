/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route, useNavigate } from "@solidjs/router";
import { initNavigation } from "./utils/navigation";
import { Notifications } from "./features/Notifications";
import { Section } from "./shared/Section";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Hide } from "./components/Hide";
import z from "zod";

import "./tailwind.css";
import "solid-devtools";

import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Index from "./pages/index";
import Projects from "./pages/projects";
import Project from "./pages/project";
import Databases from "./pages/databases";
import GroupSelect from "./pages/groupSelect";
import Guides from "./pages/guides";

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
    return (
      <>
        <Hide key="header">
          <Header />
        </Hide>
        <Notifications />
        <div class="flex min-h-screen gap-0.5">
          <Section class="h-auto grow p-0! max-md:hidden" />
          <div class="flex w-full max-w-[1264px] flex-col gap-0.5">
            {props.children}
            <Hide key="footer">
              <Footer />
            </Hide>
          </div>
          <Section class="h-auto grow p-0! max-md:hidden" />
        </div>
      </>
    );
  };

  return (
    <Router root={layout}>
      <Route
        component={(props: any) => {
          const navigator = useNavigate();
          initNavigation(navigator);

          return props.children;
        }}
      >
        <Route path="/" component={Index} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:id" component={Project} />
        <Route path="/databases" component={Databases} />
        <Route path="/group-select" component={GroupSelect} />
        <Route path="/guides" component={Guides} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
      </Route>
    </Router>
  );
};

render(App, document.body);
