import { Book, Database, ExternalLink, FileIcon, Plus } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";
import { A, useLocation, useNavigate } from "@solidjs/router";
import type { SubjectProjects } from "../entities/projects";
import { ProjectsCreateModal } from "./ProjectsCreateModal";
import { Block } from "../shared/Block";
import { Section } from "../shared/Section";
import { Skeleton } from "../shared/Skeleton";
import { Volume } from "../shared/Volume";
import { Button } from "../shared/uikit/Button";

export type ProjectsSubjectsSectionProps = {
  subjects: SubjectProjects[];
  isLoading: boolean;
};

function teacherName(subject: SubjectProjects) {
  return `${subject.teacher.lastName} ${subject.teacher.firstName}${
    subject.teacher.patronymic ? ` ${subject.teacher.patronymic}` : ""
  }`;
}

const sectionSkeleton = () => (
  <Section>
    <div class="flex justify-between">
      <div class="gap-md flex flex-col">
        <div class="gap-xs flex">
          <Skeleton class="mt-1 size-4" radius="sm" />
          <Skeleton class="h-4 w-64" radius="sm" />
        </div>
        <Skeleton class="h-4 w-48" radius="sm" />
      </div>
      <div class="gap-sm flex w-64 flex-col">
        <Skeleton class="h-1 w-full" radius="sm" />
        <Skeleton class="h-4 w-40" radius="sm" />
      </div>
    </div>
    <div class="gap-md grid grid-cols-4">
      <Skeleton class="h-32 w-full" radius="md" />
      <Skeleton class="h-32 w-full" radius="md" />
      <Skeleton class="h-32 w-full" radius="md" />
    </div>
  </Section>
);

export function ProjectsSubjectsSection(props: ProjectsSubjectsSectionProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSubjectId, setActiveSubjectId] = createSignal("");

  const searchParams = () => new URLSearchParams(location.search);

  const isCreateModalOpen = () =>
    searchParams().get("projectCreate") === "open";

  const openCreateModal = (subjectId: string) => {
    setActiveSubjectId(subjectId);
    const params = searchParams();
    params.set("projectCreate", "open");

    navigate(`${location.pathname}?${params.toString()}`, {
      replace: true,
    });
  };

  const closeCreateModal = () => {
    setActiveSubjectId("");
    const params = searchParams();
    params.delete("projectCreate");

    const nextSearch = params.toString();

    navigate(
      nextSearch ? `${location.pathname}?${nextSearch}` : location.pathname,
      {
        replace: true,
      },
    );
  };

  return (
    <Show
      when={!props.isLoading}
      fallback={
        <>
          {sectionSkeleton()}
          {sectionSkeleton()}
        </>
      }
    >
      <Show
        when={props.subjects.length}
        fallback={
          <Section>
            <span class="text-neutral-500">Ничего не найдено</span>
          </Section>
        }
      >
        <For each={props.subjects}>
          {(subject) => (
            <Section>
              <div class="flex justify-between">
                <div class="gap-md flex flex-col">
                  <div class="gap-xs flex">
                    <Book />
                    {subject.name}
                  </div>
                  <span class="text-neutral-500">{teacherName(subject)}</span>
                </div>
                <div class="gap-sm flex flex-col">
                  <div class="h-1 w-full rounded-full bg-neutral-300">
                    <div
                      class="bg-success-300 h-full rounded-full ring-1 ring-neutral-100"
                      style={{
                        width: `${Math.min(
                          100,
                          subject.diskUsage.avaliableBytes <= 0
                            ? 0
                            : (subject.diskUsage.usedBytes /
                                subject.diskUsage.avaliableBytes) *
                                100,
                        )}%`,
                      }}
                    />
                  </div>
                  <div class="gap-sm flex">
                    <Volume bytes={subject.diskUsage.usedBytes} />
                    /
                    <Volume bytes={subject.diskUsage.avaliableBytes} />
                  </div>
                </div>
              </div>
              <div class="gap-md grid grid-cols-4">
                <Button
                  variant="lined"
                  iconStart={<Plus />}
                  class="h-32"
                  onclick={() => openCreateModal(subject.id)}
                >
                  Создать новый проект
                </Button>
                <For each={subject.projects}>
                  {(project) => (
                    <A href={`/projects/${project.id}`}>
                      <Block
                        class="h-full"
                        label={
                          <div class="gap-sm flex flex-col">
                            {project.name}
                            <span class="text-neutral-500 underline">
                              {project.alias}
                            </span>
                          </div>
                        }
                        icon={<ExternalLink />}
                      >
                        <div class="gap-md flex">
                          <div class="gap-xs flex">
                            <FileIcon class="text-neutral-500" />
                            <Volume bytes={project.diskUsage.fileBytes} />
                          </div>
                          <span class="text-neutral-500">|</span>
                          <div class="gap-xs flex">
                            <Database class="text-neutral-500" />
                            <Volume bytes={project.diskUsage.databaseBytes} />
                          </div>
                        </div>
                      </Block>
                    </A>
                  )}
                </For>
              </div>
            </Section>
          )}
        </For>
      </Show>
      <Show when={isCreateModalOpen()}>
        <ProjectsCreateModal
          isOpen={true}
          selectedSubjectId={activeSubjectId()}
          onclose={closeCreateModal}
        />
      </Show>
    </Show>
  );
}
