import {
  BookOpen,
  ChevronRight,
  Database,
  ExternalLink,
  Map,
  PanelsTopLeft,
  SquarePen,
  SquareUser,
  User,
} from "lucide-solid";
import { Section } from "../shared/Section";
import { Button } from "../shared/uikit/Button";
import { Block } from "../shared/Block";
import { createResource, Suspense } from "solid-js";
import { fetchAccountMetrics, fetchProfile } from "../entities/profile";
import { A } from "@solidjs/router";
import { Skeleton } from "../shared/Skeleton";
import { SubjectsSection } from "../features/SubjectsSection";
import { Volume } from "../shared/Volume";

export default function () {
  const [profile] = createResource(fetchProfile);
  const [metrics] = createResource(fetchAccountMetrics);
  return (
    <>
      <Section class="gap-xl flex flex-row items-center justify-between">
        <div class="gap-xl flex items-center">
          <div class="flex size-10 items-center justify-center rounded-[6px] text-[24px] text-neutral-500 ring-1 ring-neutral-400 ring-inset">
            <User strokeWidth={1.5} />
          </div>
          <div class="gap-sm flex flex-col">
            <Suspense
              fallback={
                <div class="gap-xs flex flex-col">
                  <Skeleton class="h-4 w-44" />
                  <Skeleton class="h-3 w-28" radius="sm" />
                </div>
              }
            >
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
                <Suspense fallback={<Skeleton class="h-7 w-48" />}>
                  <Volume
                    bytes={metrics()?.diskUsage.usedBytes ?? 0}
                    valueClass="text-2xl text-neutral-700"
                    unitClass="text-sm text-neutral-500"
                  />{" "}
                  /{" "}
                  <Volume
                    bytes={metrics()?.diskUsage.avaliableBytes ?? 0}
                    valueClass="text-2xl text-neutral-700"
                    unitClass="text-sm text-neutral-500"
                  />
                  <span class="text-neutral-500">
                    (
                    {(() => {
                      const used = metrics()?.diskUsage.usedBytes ?? 0;
                      const available =
                        metrics()?.diskUsage.avaliableBytes ?? 0;
                      const percent =
                        available > 0
                          ? Math.round((used / available) * 100)
                          : 0;

                      return `${Math.min(100, percent)}%`;
                    })()}
                    )
                  </span>
                </Suspense>
              </div>
            }
          >
            <div class="gap-md flex flex-col items-start">
              <span class="group-hover:text-primary-300 text-neutral-500">
                Использование диска
              </span>
              <div class="h-1 w-full rounded-full bg-neutral-300">
                <div
                  class="bg-warning-300 h-full rounded-full"
                  style={{
                    width: (() => {
                      const used = metrics()?.diskUsage.usedBytes ?? 0;
                      const available =
                        metrics()?.diskUsage.avaliableBytes ?? 0;
                      const percent =
                        available > 0
                          ? Math.round((used / available) * 100)
                          : 0;

                      return `${Math.min(100, percent)}%`;
                    })(),
                  }}
                />
              </div>
            </div>
          </Block>
          <Block
            title="Подробнее"
            class="h-32"
            icon={<ExternalLink />}
            label={
              <Suspense fallback={<Skeleton class="h-7 w-10" />}>
                <span class="text-2xl text-neutral-700">
                  {metrics()?.projectCount ?? 0}
                </span>
              </Suspense>
            }
          >
            <span class="group-hover:text-primary-300 text-neutral-500">
              Всего проектов
            </span>
          </Block>
          <Block
            class="h-32"
            label={
              <Suspense fallback={<Skeleton class="h-7 w-10" />}>
                <span class="text-2xl text-neutral-700">
                  {metrics()?.subjectCount ?? 0}
                </span>
              </Suspense>
            }
          >
            <span class="group-hover:text-primary-300 text-neutral-500">
              Всего предметов
            </span>
          </Block>
        </div>
      </Section>
      <Section labelIcon={<Map />} label="Навигация">
        <div class="gap-md grid grid-cols-3">
          <A href="/projects">
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
          </A>
          <A href="/databases">
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
          </A>
          <A href="/guides">
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
                  <span class="text-neutral-500">
                    Как пользоваться сервисом
                  </span>
                </div>
                <ChevronRight class="group-hover:text-primary-300 text-xl" />
              </div>
            </Block>
          </A>
        </div>
      </Section>
      <SubjectsSection />
    </>
  );
}
