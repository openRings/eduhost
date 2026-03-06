import { Section } from "../shared/Section";
import { ArrowUpRight, LogOut, Send } from "lucide-solid";
import { Button } from "../shared/uikit/Button";
import { HideController } from "../components/Hide";
import { Select } from "../shared/uikit/Select";
import { Input } from "../shared/uikit/Input";
import { createResource, createSignal, Show } from "solid-js";
import { fetchGroups } from "../entities/groups";
import { Skeleton } from "../shared/Skeleton";
import { resetCurrentGroupId, setCurrentGroupId } from "../utils/group";
import { useNavigate } from "@solidjs/router";
import { logout as logoutSession } from "../utils/auth";

export default function () {
  const [selectedGroup, setSelectedGroup] = createSignal("");
  const [inviteCode, setInviteCode] = createSignal("");
  const [groups] = createResource(fetchGroups);
  const navigate = useNavigate();

  const groupItems = () =>
    (groups() ?? []).map((group) => ({ label: group.name, value: group.id }));

  const logout = async () => {
    await logoutSession();
    resetCurrentGroupId();
    navigate("/signin");
  };

  return (
    <Section class="h-screen items-center justify-center">
      <HideController keys={["header", "footer"]} />
      <Show
        when={!groups.loading}
        fallback={
          <div class="gap-xl flex w-[360px] flex-col">
            <Skeleton class="h-7 w-40" radius="sm" />
            <Skeleton class="h-8 w-full" radius="sm" />
            <Skeleton class="h-8 w-28" radius="sm" />
            <Skeleton class="h-[1px] w-full" radius="sm" />
            <Skeleton class="h-7 w-52" radius="sm" />
            <Skeleton class="h-8 w-full" radius="sm" />
            <div class="gap-md flex">
              <Skeleton class="h-8 w-24" radius="sm" />
              <Skeleton class="h-8 grow" radius="sm" />
            </div>
          </div>
        }
      >
        <Show
          when={Boolean(groups()?.length)}
          fallback={
            <div class="gap-xl flex w-[360px] flex-col">
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
                  onclick={logout}
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
          }
        >
          <div class="gap-3xl flex w-[360px] flex-col">
            <div class="gap-xl flex flex-col">
              <h1 class="text-lg text-neutral-400">Выбор группы</h1>
              <Select
                items={groupItems()}
                onselect={(v) => setSelectedGroup(v)}
                placeholder="Выберите группу"
                class="w-full"
                autosize={false}
              />
              <Button
                title="Выбрать эту группу"
                iconStart={<ArrowUpRight />}
                disabled={!selectedGroup()}
                onclick={() => {
                  setCurrentGroupId(selectedGroup());
                  navigate("/");
                }}
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
                  title="Отправить запрос"
                  pendingText="Отправка.."
                  class="grow"
                  variant="default"
                  iconStart={<Send />}
                  disabled={!inviteCode()}
                >
                  Отправить запрос
                </Button>
              </div>
            </div>
          </div>
        </Show>
      </Show>
    </Section>
  );
}
