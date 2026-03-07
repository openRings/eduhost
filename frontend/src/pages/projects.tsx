import {
  Book,
  BrushCleaning,
  Database,
  ExternalLink,
  FileIcon,
  Plus,
  Search,
} from "lucide-solid";
import { Section } from "../shared/Section";
import { Input } from "../shared/uikit/Input";
import { createResource, createSignal, Show } from "solid-js";
import { Select } from "../shared/uikit/Select";
import { Button } from "../shared/uikit/Button";
import { fetchSubjects } from "../entities/subjects";
import { currentGroupId } from "../utils/group";
import { Skeleton } from "../shared/Skeleton";
import { Block } from "../shared/Block";
import { Volume } from "../shared/Volume";

export default function () {
  const [query, setQuery] = createSignal("");
  const [subjects] = createResource(currentGroupId, fetchSubjects);

  const subjectItems = () =>
    (subjects() ?? []).map((subject) => ({
      value: subject.id,
      label: subject.name,
    }));

  return (
    <>
      <Section class="gap-md flex flex-row">
        <Input
          icon={<Search />}
          containerClass="grow"
          placeholder="Найти.."
          value={query()}
          oninput={(e) => setQuery(e.target.value)}
          onclear={() => setQuery("")}
        />
        <Show
          when={!subjects.loading}
          fallback={<Skeleton class="h-8 w-56" radius="sm" />}
        >
          <Select
            items={subjectItems()}
            placeholder="Выберите предмет"
            onselect={() => {}}
            autosize={false}
            class="w-56"
          />
        </Show>
        <Button iconStart={<BrushCleaning />}>Очистить фильтры</Button>
        <Button iconStart={<Plus />} variant="accent">
          Новый предмет
        </Button>
      </Section>
      <Section>
        <div class="flex justify-between">
          <div class="gap-md flex flex-col">
            <div class="gap-xs flex">
              <Book />
              Проектирование и разработка веб приложений
            </div>
            <span class="text-neutral-500">Пташкин Олег Генрихович</span>
          </div>
          <div class="gap-sm flex flex-col">
            <div class="h-1 w-full rounded-full bg-neutral-300">
              <div class="bg-success-300 h-full w-[44%] rounded-full ring-1 ring-neutral-100" />
            </div>
            <div class="gap-sm flex">
              <Volume bytes={0} />
              /
              <Volume bytes={1024} />
            </div>
          </div>
        </div>
        <div class="gap-md grid grid-cols-4">
          <Button variant="lined" iconStart={<Plus />} class="h-32">
            Создать новый проект
          </Button>
          <Block
            label={
              <div class="gap-sm flex flex-col">
                Интернет магазин сандалей
                <span class="text-neutral-500 underline">
                  sandaly.p.edukip.ru
                </span>
              </div>
            }
            icon={<ExternalLink />}
          >
            <div class="gap-md flex">
              <div class="gap-xs flex">
                <FileIcon class="text-neutral-500" />
                <Volume bytes={0} />
              </div>
              <span class="text-neutral-500">|</span>
              <div class="gap-xs flex">
                <Database class="text-neutral-500" />
                <Volume bytes={0} />
              </div>
            </div>
          </Block>
        </div>
      </Section>
    </>
  );
}
