/* @refresh reload */
import { render } from "solid-js/web";
import "./tailwind.css";
import "solid-devtools";
import { Button } from "./shared/uikit/Button";
import { Settings } from "lucide-solid";

const App = () => {
  return (
    <div class="gap-xl mx-auto flex w-120 flex-col">
      <p class="py-20 text-center text-4xl text-green-700">Hello tailwind!</p>
      <div class="gap-md flex items-center">
        <Button iconStart={<Settings />} disabled>
          Нажми на меня
        </Button>
        <Button size="sm">Нажми на меня</Button>
      </div>
      <div class="gap-md flex items-center">
        <Button variant="transparent" disabled>
          Нажми на меня
        </Button>
        <Button size="sm" variant="transparent">
          Нажми на меня
        </Button>
      </div>
      <div class="gap-md flex items-center">
        <Button variant="accent" disabled>
          Нажми на меня
        </Button>
        <Button size="sm" variant="accent">
          Нажми на меня
        </Button>
      </div>
      <div class="gap-md flex items-center">
        <Button variant="primary" disabled>
          Нажми на меня
        </Button>
        <Button size="sm" variant="primary">
          Нажми на меня
        </Button>
      </div>
      <div class="gap-md flex items-center">
        <Button variant="danger" disabled onclick={() => console.log(123)}>
          Нажми на меня
        </Button>
        <Button size="sm" variant="danger">
          Нажми на меня
        </Button>
      </div>
    </div>
  );
};

render(App, document.body);
