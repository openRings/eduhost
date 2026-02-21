import { ExternalLink } from "lucide-solid";
import { Block } from "../shared/Block";
import { Section } from "../shared/Section";

export default function () {
  return (
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
  );
}
