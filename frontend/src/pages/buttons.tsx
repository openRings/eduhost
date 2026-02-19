import { Settings } from "lucide-solid";
import { Button } from "../shared/uikit/Button";

export default function () {
  return (
    <div class="gap-xl mx-auto flex w-140 flex-col">
      <p class="py-20 text-center text-4xl text-green-700">Hello tailwind!</p>
      <div class="gap-md flex items-center">
        <Button iconStart={<Settings />} disabled>
          Нажми на меня
        </Button>
        <Button iconStart={<Settings />} isLoading>
          Нажми на меня
        </Button>
        <Button size="icon-md">
          <Settings />
        </Button>
        <Button size="icon-md" isLoading>
          <Settings />
        </Button>
        <Button size="sm">Нажми на меня</Button>
        <Button size="icon-sm">
          <Settings />
        </Button>
      </div>
      <div class="gap-md flex items-center">
        <Button variant="transparent" disabled>
          Нажми на меня
        </Button>
        <Button variant="transparent" size="icon-md">
          <Settings />
        </Button>
        <Button size="sm" variant="transparent">
          Нажми на меня
        </Button>
        <Button variant="transparent" size="icon-sm">
          <Settings />
        </Button>
      </div>
      <div class="gap-md flex items-center">
        <Button variant="accent" disabled>
          Нажми на меня
        </Button>
        <Button variant="accent" size="icon-md">
          <Settings />
        </Button>
        <Button size="sm" variant="accent">
          Нажми на меня
        </Button>
        <Button variant="accent" size="icon-sm">
          <Settings />
        </Button>
      </div>
      <div class="gap-md flex items-center">
        <Button variant="primary" disabled>
          Нажми на меня
        </Button>
        <Button variant="primary" size="icon-md">
          <Settings />
        </Button>
        <Button size="sm" variant="primary">
          Нажми на меня
        </Button>
        <Button variant="primary" size="icon-sm">
          <Settings />
        </Button>
      </div>
      <div class="gap-md flex items-center">
        <Button variant="danger" disabled>
          Нажми на меня
        </Button>
        <Button variant="danger" size="icon-md">
          <Settings />
        </Button>
        <Button size="sm" variant="danger">
          Нажми на меня
        </Button>
        <Button variant="danger" size="icon-sm">
          <Settings />
        </Button>
      </div>
    </div>
  );
}
