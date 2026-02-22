import { BrushCleaning, ExternalLink, Plus } from "lucide-solid";
import { Block } from "../shared/Block";
import { Section } from "../shared/Section";
import { Button } from "../shared/uikit/Button";
import { Input } from "../shared/uikit/Input";
import { Select } from "../shared/uikit/Select";

export default function () {
  return (
    <>
      <Section title="Блоки">
        <div class="gap-md flex">
          <Block
            class="h-36 grow"
            title={[
              "Заголовок",
              <span class="text-neutral-500 underline">Подзаголовок</span>,
            ]}
            icon={<ExternalLink />}
          >
            123123
          </Block>
          <Block
            class="h-36 grow"
            title={[
              "Заголовок",
              <span class="text-neutral-500 underline">Подзаголовок</span>,
            ]}
            icon={<ExternalLink />}
          >
            123123
          </Block>
          <Block
            class="h-36 grow"
            title={[
              "Заголовок",
              <span class="text-neutral-500 underline">Подзаголовок</span>,
            ]}
            icon={<ExternalLink />}
          >
            123123
          </Block>
        </div>
      </Section>
      <Section class="gap-md flex-row">
        <Input placeholder="Найти.." containerClass="grow" />
        <Select
          items={[
            { label: "Проектирование и раз...", value: "1" },
            { label: "Оптимизация веб прил...", value: "2" },
          ]}
          onselect={(value) => console.log(value)}
          placeholder="Выберите предмет"
        />
        <Button iconStart={<BrushCleaning />}>Сбросить фильтры</Button>
        <Button iconStart={<Plus />} variant="accent">
          Новый проект
        </Button>
      </Section>
    </>
  );
}
