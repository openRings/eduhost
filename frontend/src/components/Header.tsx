import { ChevronsUpDown } from "lucide-solid";
import { Button } from "../shared/uikit/Button";

export type HeaderProps = {};

export function Header(_props: HeaderProps) {
  return (
    <header class="py-2xl px-6xl sticky top-0 right-0 left-0 z-10 flex justify-center border-b border-neutral-300 bg-white/80 backdrop-blur-xs">
      <nav class="grid w-full max-w-[1200px] grid-cols-4 text-neutral-600">
        <div class="flex items-center justify-start">
          <Button variant="transparent" iconStart={<ChevronsUpDown />}>
            Студент
          </Button>
          <span class="text-neutral-400">/</span>
          <Button variant="transparent">4ИСиП-111</Button>
        </div>
        <div class="gap-md col-span-2 flex items-center justify-center">
          <Button href="/" variant="transparent" class="text-primary-300">
            Главная
          </Button>
          <Button href="/" variant="transparent">
            Проекты
          </Button>
          <Button href="/" variant="transparent">
            Базы данных
          </Button>
          <Button href="/" variant="transparent">
            Гайды
          </Button>
        </div>
        <div class="flex items-center justify-end">
          <Button variant="transparent" class="gap-md!">
            Иванов иван
            <div class="size-6 rounded-full bg-neutral-700" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
