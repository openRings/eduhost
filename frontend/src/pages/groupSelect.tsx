import { Section } from "../shared/Section";
import { ArrowUpRight, LogOut, Send } from "lucide-solid";
import { Button } from "../shared/uikit/Button";
import { HideController } from "../components/Hide";
import { Select } from "../shared/uikit/Select";
import { Input } from "../shared/uikit/Input";
import { createSignal } from "solid-js";

export default function () {
  const [selectedGroup, setSelectedGroup] = createSignal("");
  const [inviteCode, setInviteCode] = createSignal("");

  return (
    <Section class="h-screen items-center justify-center">
      <HideController keys={["header", "footer"]} />
      <div class="gap-3xl flex w-[360px] flex-col">
        <div class="gap-xl flex flex-col">
          <h1 class="text-lg text-neutral-400">Выбор группы</h1>
          <Select
            items={[
              { label: "4ИСиП-722", value: "uuid1" },
              { label: "2ИСиП-322", value: "uuid2" },
            ]}
            onselect={(v) => setSelectedGroup(v)}
            placeholder="Выберите группу"
            class="w-full"
            autosize={false}
          />
          <Button
            title="Выбрать эту группу"
            iconStart={<ArrowUpRight />}
            disabled={!selectedGroup()}
          >
            Выбрать
          </Button>
        </div>
        <div class="gap-md flex w-full items-center">
          <div class="h-[1px] grow rounded-full bg-neutral-300" />
          <span class="text-neutral-500">или</span>
          <div class="h-[1px] grow rounded-full bg-neutral-300" />
        </div>
        <div class="gap-xl flex flex-col">
          <h1 class="text-lg text-neutral-400">Вступление в группу</h1>
          <Input
            placeholder="Введите код вступления"
            oninput={(e) => setInviteCode(e.target.value)}
          />
          <div class="gap-md flex">
            <Button
              title="Выйти из аккаунта"
              variant="danger"
              iconStart={<LogOut />}
            >
              Выйти
            </Button>
            <Button
              title="Отправить запрос"
              pendingText="Отправка.."
              class="grow"
              variant="primary"
              iconStart={<Send />}
              disabled={!inviteCode()}
            >
              Отправить запрос
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
