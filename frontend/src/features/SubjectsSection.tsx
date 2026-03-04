import { Book, Plus } from "lucide-solid";
import { createResource, For, Show, Suspense } from "solid-js";
import { SubjectCard } from "../components/SubjectCard";
import { fetchSubjects } from "../entities/subjects";
import { Section } from "../shared/Section";
import { Skeleton } from "../shared/Skeleton";
import { Button } from "../shared/uikit/Button";

export type SubjectsSectionProps = {};

const subjectSkeleton = () => (
  <div class="p-2xl h-[176px] rounded-md bg-neutral-200/70">
    <div class="gap-2xl flex h-full flex-col justify-between">
      <div class="gap-sm flex flex-col">
        <Skeleton class="h-4 w-5/6" />
        <Skeleton class="h-3 w-40" radius="sm" />
      </div>
      <div class="gap-sm flex flex-col">
        <div class="gap-xl flex">
          <Skeleton class="h-3 w-20" radius="sm" />
          <Skeleton class="h-3 w-20" radius="sm" />
          <Skeleton class="h-3 w-20" radius="sm" />
        </div>
        <Skeleton class="h-1 w-full" radius="sm" />
      </div>
    </div>
  </div>
);

export function SubjectsSection(_props: SubjectsSectionProps) {
  const [subjects] = createResource(fetchSubjects);

  return (
    <Section labelIcon={<Book />} label="Предметы">
      <div class="gap-md grid grid-cols-3">
        <Button iconStart={<Plus />} class="h-[176px]" variant="lined">
          Добавить предмет
        </Button>
        <Suspense
          fallback={
            <>
              {subjectSkeleton()}
              {subjectSkeleton()}
            </>
          }
        >
          <Show when={subjects()?.length}>
            <For each={subjects()}>
              {(subject) => <SubjectCard subject={subject} />}
            </For>
          </Show>
        </Suspense>
      </div>
    </Section>
  );
}
