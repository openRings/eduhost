import { UserCog, UserPlus, Users } from "lucide-solid";
import { For } from "solid-js";
import type { ProjectDetails } from "../entities/projects";
import { Section } from "../shared/Section";
import { Skeleton } from "../shared/Skeleton";
import { Button } from "../shared/uikit/Button";

export type ProjectAccessSectionProps = {
  project?: ProjectDetails;
  isLoading: boolean;
};

function userName(user: ProjectDetails["users"][number]) {
  return `${user.lastName} ${user.firstName}${user.patronymic ? ` ${user.patronymic}` : ""}`;
}

export function ProjectAccessSection(props: ProjectAccessSectionProps) {
  return (
    <Section labelIcon={<Users />} label="Совместный доступ">
      <p class="max-w-1/2 leading-[150%] text-neutral-500">
        Совместный доступ к проекту для группы студентов
      </p>
      <div class="gap-md flex">
        <Button variant="primary" iconStart={<UserPlus />}>
          Добавить пользователя
        </Button>
        <Button iconStart={<UserCog />}>Управлять правами</Button>
      </div>
      <div class="gap-sm flex flex-col rounded-md bg-linear-to-t from-neutral-100 to-white p-4 ring-1 ring-neutral-300 ring-inset">
        <div class="gap-xl flex p-2 pt-1 text-neutral-500">
          <span class="flex-2">ФИО</span>
          <span class="flex-1">Юзернейм</span>
          <span class="flex-1 text-end">Статус</span>
        </div>
        <For
          each={
            props.isLoading
              ? Array.from({ length: 2 })
              : (props.project?.users ?? [])
          }
        >
          {(user) =>
            props.isLoading ? (
              <div class="gap-xl flex border-t border-neutral-300 p-2">
                <Skeleton class="h-5 flex-2" radius="sm" />
                <Skeleton class="h-5 flex-1" radius="sm" />
                <Skeleton class="h-5 flex-1" radius="sm" />
              </div>
            ) : (
              <div class="gap-xl flex border-t border-neutral-300 p-2">
                <span class="flex-2">
                  {userName(user as ProjectDetails["users"][number])}
                </span>
                <span class="flex-1"></span>
                <span class="flex-1 text-end">
                  {(user as ProjectDetails["users"][number]).id ===
                  props.project?.owner.id
                    ? "Владелец"
                    : "Участник"}
                </span>
              </div>
            )
          }
        </For>
      </div>
    </Section>
  );
}
