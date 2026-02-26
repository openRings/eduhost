import {
  BellRing,
  BrushCleaning,
  ExternalLink,
  PanelsTopLeft,
  Plus,
  Search,
} from "lucide-solid";
import { Block } from "../shared/Block";
import { Section } from "../shared/Section";
import { Button } from "../shared/uikit/Button";
import { Input } from "../shared/uikit/Input";
import { Select } from "../shared/uikit/Select";
import { Label } from "../shared/uikit/Label";
import { Notification } from "../components/Notification";
import { createSignal } from "solid-js";
import { fetchSession } from "../entities/session";

export default function () {
  const [sessionId, setSessionId] = createSignal("");

  const fetchSessionId = async () => {
    const session = await fetchSession();

    setSessionId(session.sessionId);
  };

  return (
    <>
      <Section label="Блоки">
        <div class="gap-md flex">
          <Block
            class="h-36 grow"
            label={<Label subLabel="Подзаголовок">Заголовок</Label>}
            icon={<ExternalLink />}
          >
            123123
          </Block>
          <Block
            class="h-36 grow"
            label={[
              "Заголовок",
              <span class="text-neutral-500 underline">Подзаголовок</span>,
            ]}
            icon={<ExternalLink />}
          >
            123123
          </Block>
          <Block
            class="h-36 grow"
            label={[
              "Заголовок",
              <span class="text-neutral-500 underline">Подзаголовок</span>,
            ]}
            icon={<ExternalLink />}
          >
            123123
          </Block>
        </div>
      </Section>
      <Section labelIcon={<PanelsTopLeft />} label="Пример заголовка">
        <div class="gap-md flex">
          <Input
            icon={<Search />}
            placeholder="Найти.."
            containerClass="grow"
          />
          <Select
            items={[
              { label: "Проектирование и раз...", value: "1" },
              { label: "Оптимизация веб прил...", value: "2" },
            ]}
            onselect={(value) => console.log(value)}
            placeholder="Выберите предмет"
          />
          <Button iconStart={<BrushCleaning />}>Сбросить фильтры</Button>
          <Button
            iconStart={<Plus />}
            variant="accent"
            onclick={fetchSessionId}
          >
            Новый проект
          </Button>
        </div>
        <div class="gap-md flex">
          <span>Текущая сессия:</span>
          <span>{sessionId() || "Пусто"}</span>
        </div>
      </Section>
      <Section labelIcon={<BellRing />} label="Уведомления">
        <Notification id="123" level="info" message="Обычное уведомление" />
        <Notification
          id="123"
          level="success"
          message="Уведомление об успешном действии"
        />
        <Notification
          id="123"
          level="warning"
          message="Длинный текст предупреждения бла бла бла бла бла бла бла бла бла бла бла"
        />
        <Notification id="123" level="error" message="Уведомление об ошибке" />
      </Section>
    </>
  );
}
