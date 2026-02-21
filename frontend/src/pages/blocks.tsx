import { ExternalLink } from "lucide-solid";
import { Block } from "../shared/Block";

export default function () {
  return (
    <div class="gap-xl mx-auto mt-40 flex w-100 flex-col">
      <Block
        title={[
          "Заголовок",
          <span class="text-neutral-500 underline">Подзаголовок</span>,
        ]}
        icon={<ExternalLink />}
      >
        123123
      </Block>
    </div>
  );
}
