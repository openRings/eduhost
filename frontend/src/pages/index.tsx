import {
  Book,
  BookOpen,
  ChevronRight,
  Database,
  ExternalLink,
  HardDrive,
  Map,
  PanelsTopLeft,
  Plus,
  SquarePen,
  SquareUser,
  User,
} from "lucide-solid";
import { Section } from "../shared/Section";
import { Button } from "../shared/uikit/Button";
import { Block } from "../shared/Block";
import { createResource, Suspense } from "solid-js";
import { fetchProfile } from "../entities/profile";
import { Label } from "../shared/uikit/Label";

export default function () {
  const [profile] = createResource(fetchProfile);

  return (
    <>
      <Section class="gap-xl flex flex-row items-center justify-between">
        <div class="gap-xl flex items-center">
          <div class="flex size-10 items-center justify-center rounded-[6px] text-[24px] text-neutral-500 ring-1 ring-neutral-400 ring-inset">
            <User strokeWidth={1.5} />
          </div>
          <div class="gap-sm flex flex-col">
            <Suspense fallback="Загрузка..">
              <span class="text-neutral-700">
                {profile()?.lastName} {profile()?.firstName}{" "}
                {profile()?.patronymic}
              </span>
              <span class="text-neutral-500">{profile()?.username}</span>
            </Suspense>
          </div>
        </div>
        <Button title="Редактировать профиль" iconStart={<SquarePen />}>
          Редактировать профиль
        </Button>
      </Section>
      <Section labelIcon={<SquareUser />} label="Аккаунт">
        <div class="gap-md grid grid-cols-6">
          <Block
            title="Подробнее"
            class="col-span-2 h-32"
            icon={<ExternalLink />}
            label={
              <div class="gap-md flex text-2xl text-neutral-700">
                <span>
                  2.26<span class="text-sm text-neutral-500">ГБ</span>
                </span>{" "}
                /{" "}
                <span>
                  3.00<span class="text-sm text-neutral-500">ГБ</span>
                </span>
                <span class="text-neutral-500">(76%)</span>
              </div>
            }
          >
            <div class="gap-md flex flex-col items-start">
              <span class="group-hover:text-primary-300 text-neutral-500">
                Использование диска
              </span>
              <div class="h-1 w-full rounded-full bg-neutral-300">
                <div class="bg-warning-300 h-full w-[76%] rounded-full" />
              </div>
            </div>
          </Block>
          <Block
            title="Подробнее"
            class="h-32"
            icon={<ExternalLink />}
            label={<span class="text-2xl text-neutral-700">5</span>}
          >
            <span class="group-hover:text-primary-300 text-neutral-500">
              Всего проектов
            </span>
          </Block>
          <Block
            class="h-32"
            label={<span class="text-2xl text-neutral-700">2</span>}
          >
            <span class="group-hover:text-primary-300 text-neutral-500">
              Всего предметов
            </span>
          </Block>
        </div>
      </Section>
      <Section labelIcon={<Map />} label="Навигация">
        <div class="gap-md grid grid-cols-3">
          <Block
            title="Проекты"
            class="h-40"
            label={<PanelsTopLeft class="text-2xl text-neutral-700" />}
          >
            <div class="flex items-end justify-between">
              <div class="gap-md flex flex-col">
                <span class="group-hover:text-primary-300 text-lg leading-none">
                  Проекты
                </span>
                <span class="text-neutral-500">Ваши предметы и проекты</span>
              </div>
              <ChevronRight class="group-hover:text-primary-300 text-xl" />
            </div>
          </Block>
          <Block
            title="Базы данных"
            class="h-40"
            label={<Database class="text-2xl text-neutral-700" />}
          >
            <div class="flex items-end justify-between">
              <div class="gap-md flex flex-col">
                <span class="group-hover:text-primary-300 text-lg leading-none">
                  Базы данных
                </span>
                <span class="text-neutral-500">Ваши базы данных</span>
              </div>
              <ChevronRight class="group-hover:text-primary-300 text-xl" />
            </div>
          </Block>
          <Block
            title="Гайды"
            class="h-40"
            label={<BookOpen class="text-2xl text-neutral-700" />}
          >
            <div class="flex items-end justify-between">
              <div class="gap-md flex flex-col">
                <span class="group-hover:text-primary-300 text-lg leading-none">
                  Гайды
                </span>
                <span class="text-neutral-500">Как пользоваться сервисом</span>
              </div>
              <ChevronRight class="group-hover:text-primary-300 text-xl" />
            </div>
          </Block>
        </div>
      </Section>
      <Section labelIcon={<Book />} label="Предметы">
        <div class="gap-md grid grid-cols-3">
          <Button iconStart={<Plus />} class="h-[176px]" variant="lined">
            Добавить предмет
          </Button>
          <Block
            label={
              <>
                <div class="flex">
                  <span class="min-w-0 flex-1 truncate">
                    Проектирование и разработка веб приложений
                  </span>
                </div>
                <span class="text-neutral-500 underline">
                  Пташкин Олег Генрихович
                </span>
              </>
            }
            icon={<ExternalLink class="min-w-3.5" />}
          >
            <div class="gap-2xl flex">
              <div class="gap-sm flex flex-1 flex-col">
                <Label icon={<HardDrive />}>Диск</Label>
                <span>
                  712<span class="text-[10px] text-neutral-500">МБ</span> / 1.00
                  <span class="text-[10px] text-neutral-500">ГБ</span>{" "}
                  <span class="text-neutral-500">(71%)</span>
                </span>
                <div class="h-1 w-full rounded-full bg-neutral-300">
                  <div class="bg-warning-300 h-full w-[71%] rounded-full" />
                </div>
              </div>
              <div class="h-full w-0.5 rounded-full bg-neutral-300" />
              <div class="gap-sm flex flex-1 flex-col">
                <Label icon={<Database />}>База данных</Label>
                <span>
                  7.05<span class="text-[10px] text-neutral-500">МБ</span> / 100
                  <span class="text-[10px] text-neutral-500">МБ</span>{" "}
                  <span class="text-neutral-500">(7%)</span>
                </span>
                <div class="h-1 w-full rounded-full bg-neutral-300">
                  <div class="bg-success-300 h-full w-[7%] rounded-full" />
                </div>
              </div>
            </div>
          </Block>
        </div>
      </Section>
    </>
  );
}
