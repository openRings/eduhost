import { ChevronsUpDown, GraduationCap, User, UserStar } from "lucide-solid";
import { Button } from "../shared/uikit/Button";
import { Skeleton } from "../shared/Skeleton";
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  JSX,
  onCleanup,
  onMount,
  Show,
  Suspense,
} from "solid-js";
import { fetchProfile } from "../entities/profile";
import { AccessLevel } from "../entities/session";
import { fetchGroups } from "../entities/groups";
import { useLocation } from "@solidjs/router";
import { Motion, Presence } from "solid-motionone";
import { currentGroupId, setCurrentGroupId } from "../utils/group";

export type HeaderProps = {};

const roleLabel = {
  [AccessLevel.Student]: "Студент",
  [AccessLevel.Teacher]: "Преподаватель",
  [AccessLevel.Admin]: "Администратор",
};

const roleIcon = {
  [AccessLevel.Student]: <User />,
  [AccessLevel.Teacher]: <GraduationCap />,
  [AccessLevel.Admin]: <UserStar />,
};

function allowedRoles(maxAccess: AccessLevel | undefined): AccessLevel[] {
  if (maxAccess === AccessLevel.Admin) {
    return [AccessLevel.Student, AccessLevel.Teacher, AccessLevel.Admin];
  }

  if (maxAccess === AccessLevel.Teacher) {
    return [AccessLevel.Student, AccessLevel.Teacher];
  }

  return [AccessLevel.Student];
}

export function Header(_props: HeaderProps) {
  const [isRoleOpen, setIsRoleOpen] = createSignal(false);
  const [selectedRole, setSelectedRole] = createSignal(AccessLevel.Student);
  let roleRef: HTMLDivElement | undefined;

  const [profile] = createResource(fetchProfile);
  const [groups] = createResource(fetchGroups);

  const availableRoles = createMemo(() => allowedRoles(profile()?.access));
  const selectedGroupName = createMemo(
    () => groups()?.find((group) => group.id === currentGroupId())?.name,
  );

  createEffect(() => {
    const roles = availableRoles();

    if (!roles.includes(selectedRole())) {
      setSelectedRole(roles[roles.length - 1] ?? AccessLevel.Student);
    }
  });

  createEffect(() => {
    const userGroups = groups() ?? [];
    if (!userGroups.length) return;

    const selectedGroup = currentGroupId();
    const hasSelectedGroup = userGroups.some(
      (group) => group.id === selectedGroup,
    );

    if (hasSelectedGroup) return;

    setCurrentGroupId(userGroups[0].id);
  });

  onMount(() => {
    const handleClick = (event: MouseEvent) => {
      if (!isRoleOpen()) return;

      const target = event.target as Node | null;

      if (target && roleRef?.contains(target)) return;

      setIsRoleOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isRoleOpen()) return;

      if (event.key === "Escape") {
        setIsRoleOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
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
              {roleLabel[selectedRole()]}
              <span class="text-neutral-400">/</span>
              <Show
                when={!groups.loading}
                fallback={<Skeleton class="h-4 w-28" radius="sm" />}
              >
                {selectedGroupName() ?? "Нет доступных групп"}
              </Show>
            </div>
          </Button>
          <Presence>
            <Show when={isRoleOpen()}>
              <Motion.div
                animate={{ opacity: [0, 1], scale: [1.02, 1.0] }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                class="p-md gap-sm absolute top-10 -left-2 flex origin-top rounded-md bg-gradient-to-t from-neutral-100 to-white shadow-md ring-1 ring-neutral-300 ring-inset"
              >
                <div class="gap-sm flex min-w-44 flex-col">
                  <For each={availableRoles()}>
                    {(role) => (
                      <Button
                        iconStart={roleIcon[role]}
                        variant="transparent"
                        class={`px-md justify-start ${
                          selectedRole() === role ? "text-primary-300" : ""
                        }`}
                        onclick={() => setSelectedRole(role)}
                      >
                        {roleLabel[role]}
                      </Button>
                    )}
                  </For>
                </div>
                <div class="gap-sm pl-sm flex min-w-44 flex-col border-l border-neutral-300">
                  <Show when={groups.loading}>
                    <div class="gap-sm px-md pt-xs flex flex-col">
                      <Skeleton class="h-4 w-32" radius="sm" />
                      <Skeleton class="h-4 w-28" radius="sm" />
                    </div>
                  </Show>
                  <Show when={!groups.loading && !groups()?.length}>
                    <span class="px-md text-sm text-neutral-500">
                      Нет доступных групп
                    </span>
                  </Show>
                  <For each={groups()}>
                    {(group) => (
                      <Button
                        variant="transparent"
                        class={`px-md justify-start ${
                          currentGroupId() === group.id
                            ? "text-primary-300"
                            : ""
                        }`}
                        onclick={() => setCurrentGroupId(group.id)}
                      >
                        {group.name}
                      </Button>
                    )}
                  </For>
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

  const isActive = createMemo(() => {
    if (props.href == "/") return location.pathname == "/";

    return location.pathname.startsWith(props.href);
  });

  return (
    <Button
      href={props.href}
      variant="transparent"
      class="hover:text-neutral-700"
      classList={{ "text-primary-300!": isActive() }}
    >
      {props.children}
    </Button>
  );
}
