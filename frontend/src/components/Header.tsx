import { ChevronsUpDown, GraduationCap, User, UserStar } from "lucide-solid";
import { Button } from "../shared/uikit/Button";
import { Skeleton } from "../shared/Skeleton";
import {
  createResource,
  createSignal,
  JSX,
  onCleanup,
  onMount,
  Show,
  Suspense,
} from "solid-js";
import { fetchProfile } from "../entities/profile";
import { useLocation } from "@solidjs/router";
import { Motion, Presence } from "solid-motionone";

export type HeaderProps = {};

export function Header(_props: HeaderProps) {
  const [isRoleOpen, setIsRoleOpen] = createSignal(false);
  let roleRef: HTMLDivElement | undefined;

  const [profile] = createResource(fetchProfile);

  onMount(() => {
    const handleClick = (event: MouseEvent) => {
      if (!isRoleOpen()) return;

      const target = event.target as Node | null;

      if (target && roleRef?.contains(target)) return;

      setIsRoleOpen(false);
    };

    document.addEventListener("mousedown", handleClick);

    onCleanup(() => {
      document.removeEventListener("mousedown", handleClick);
    });
  });

  return (
    <header class="py-2xl px-6xl sticky top-0 right-0 left-0 z-10 flex justify-center border-b border-neutral-300 bg-white/80 backdrop-blur-xs">
      <nav class="grid w-full max-w-[1200px] grid-cols-4 text-neutral-600">
        <div ref={roleRef} class="relative flex items-center justify-start">
          <Button
            class="-ml-md hover:text-neutral-700"
            variant="transparent"
            classList={{
              "bg-neutral-200 text-neutral-700": isRoleOpen(),
            }}
            onclick={() => setIsRoleOpen((prev) => !prev)}
            iconStart={<ChevronsUpDown />}
          >
            <div class="gap-md flex">
              Студент
              <span class="text-neutral-400">/</span>
              4ИСиП-111
            </div>
          </Button>
          <Presence>
            <Show when={isRoleOpen()}>
              <Motion.div
                animate={{ opacity: [0, 1], scale: [1.025, 1.0], y: [4, 0] }}
                exit={{ opacity: 0, scale: 1.025 }}
                class="p-md gap-sm absolute top-10 -left-2 flex rounded-md bg-gradient-to-t from-neutral-100 to-white shadow-md ring-1 ring-neutral-300 ring-inset"
              >
                <div class="gap-sm flex min-w-44 flex-col">
                  <Button
                    iconStart={<User />}
                    variant="transparent"
                    class="px-md text-primary-300 justify-start"
                  >
                    Студент
                  </Button>
                  <Button
                    iconStart={<GraduationCap />}
                    variant="transparent"
                    class="px-md justify-start"
                  >
                    Преподаватель
                  </Button>
                  <Button
                    iconStart={<UserStar />}
                    variant="transparent"
                    class="px-md justify-start"
                  >
                    Администратор
                  </Button>
                </div>
                <div class="gap-sm pl-sm flex min-w-44 flex-col border-l border-neutral-300">
                  <Button
                    variant="transparent"
                    class="px-md text-primary-300 justify-start"
                  >
                    4ИСиП-111
                  </Button>
                  <Button variant="transparent" class="px-md justify-start">
                    3ИСиП-222
                  </Button>
                </div>
              </Motion.div>
            </Show>
          </Presence>
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
            <Suspense fallback={<Skeleton class="h-4 w-32" radius="sm" />}>
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
