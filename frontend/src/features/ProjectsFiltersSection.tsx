import { BrushCleaning, Plus, Search } from "lucide-solid";
import { Section } from "../shared/Section";
import { Input } from "../shared/uikit/Input";
import { Select, type SelectOption } from "../shared/uikit/Select";
import { Button } from "../shared/uikit/Button";
import { Show } from "solid-js";
import { Skeleton } from "../shared/Skeleton";

export type ProjectsFiltersSectionProps = {
  query: string;
  onQueryInput: (value: string) => void;
  selectedSubjectId: string;
  onSubjectSelect: (subjectId: string) => void;
  subjectItems: SelectOption[];
  isSubjectsLoading: boolean;
  onClear: () => void;
};

export function ProjectsFiltersSection(props: ProjectsFiltersSectionProps) {
  return (
    <Section class="gap-md flex flex-row">
      <Input
        icon={<Search />}
        containerClass="grow"
        placeholder="Найти.."
        value={props.query}
        oninput={(e) => props.onQueryInput(e.target.value)}
        onclear={() => props.onQueryInput("")}
      />
      <Show
        when={!props.isSubjectsLoading}
        fallback={<Skeleton class="h-8 w-56" radius="sm" />}
      >
        <Select
          items={props.subjectItems}
          placeholder="Выберите предмет"
          onselect={props.onSubjectSelect}
          value={
            props.selectedSubjectId ? [props.selectedSubjectId] : undefined
          }
          autosize={false}
          class="w-56"
        />
      </Show>
      <Button iconStart={<BrushCleaning />} onclick={props.onClear}>
        Очистить фильтры
      </Button>
      <Button iconStart={<Plus />} variant="accent">
        Новый предмет
      </Button>
    </Section>
  );
}
