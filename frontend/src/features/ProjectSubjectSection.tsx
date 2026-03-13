import { Book, Info } from "lucide-solid";
import type { ProjectDetails } from "../entities/projects";
import { Section } from "../shared/Section";
import { Skeleton } from "../shared/Skeleton";
import { Button } from "../shared/uikit/Button";

export type ProjectSubjectSectionProps = {
  project?: ProjectDetails;
  isLoading: boolean;
};

function teacherName(project?: ProjectDetails) {
  const teacher = project?.subject.teacher;
  if (!teacher) return "";

  return `${teacher.lastName} ${teacher.firstName}${teacher.patronymic ? ` ${teacher.patronymic}` : ""}`;
}

export function ProjectSubjectSection(props: ProjectSubjectSectionProps) {
  return (
    <Section class="flex flex-row items-center justify-between">
      <div class="gap-sm flex flex-col">
        <div class="gap-xs flex">
          <Book />
          {props.isLoading ? (
            <Skeleton class="mt-1 h-4 w-64" radius="sm" />
          ) : (
            (props.project?.subject.name ?? "")
          )}
        </div>
        {props.isLoading ? (
          <Skeleton class="h-4 w-48" radius="sm" />
        ) : (
          <span class="text-neutral-500">{teacherName(props.project)}</span>
        )}
      </div>
      <Button iconStart={<Info />}>Подробнее о предмете</Button>
    </Section>
  );
}
