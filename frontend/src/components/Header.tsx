import { ChevronsUpDown } from "lucide-solid";
import { Button } from "../shared/uikit/Button";
import { createResource, JSX, Suspense } from "solid-js";
import { fetchProfile } from "../entities/profile";
import { useLocation } from "@solidjs/router";

export type HeaderProps = {};

export function Header(_props: HeaderProps) {
  const [profile] = createResource(fetchProfile);

  return (
    <header class="py-2xl px-6xl sticky top-0 right-0 left-0 z-10 flex justify-center border-b border-neutral-300 bg-white/80 backdrop-blur-xs">
      <nav class="grid w-full max-w-[1200px] grid-cols-4 text-neutral-600">
        <div class="flex items-center justify-start">
          <Button
            class="-ml-md hover:text-neutral-700"
            variant="transparent"
            iconStart={<ChevronsUpDown />}
          >
            <div class="gap-md flex">
              Студент
              <span class="text-neutral-400">/</span>
              4ИСиП-111
            </div>
          </Button>
        </div>
        <div class="gap-md col-span-2 flex items-center justify-center">
          <NavLink href="/">Главная</NavLink>
          <NavLink href="/projects">Проекты</NavLink>
          <NavLink href="/databases">Базы данных</NavLink>
          <NavLink href="/guides">Гайды</NavLink>
        </div>
        <div class="flex items-center justify-end">
          <Button
            variant="transparent"
            class="gap-md! -mr-md hover:text-neutral-700"
          >
            <Suspense fallback="Загрузка..">
              {profile()?.lastName} {profile()?.firstName}
            </Suspense>
            <div class="size-6 rounded-full bg-neutral-700" />
          </Button>
        </div>
      </nav>
    </header>
  );
}

type HeaderLinkProps = {
  href: string;
  children: JSX.Element;
};

function NavLink(props: HeaderLinkProps) {
  const location = useLocation();

  return (
    <Button
      href={props.href}
      variant="transparent"
      class="hover:text-neutral-700"
      classList={{
        "text-primary-300!": location.pathname == props.href,
      }}
    >
      {props.children}
    </Button>
  );
}
