import { createResource } from "solid-js";
import { fetchProfile } from "../entities/profile";
import { SquarePen, User } from "lucide-solid";
import { Suspense } from "solid-js";
import { Skeleton } from "../shared/Skeleton";
import { Button } from "../shared/uikit/Button";
import { Section } from "../shared/Section";

export type AccountHeaderSectionProps = {};

export function AccountHeaderSection(_props: AccountHeaderSectionProps) {
  const [profile] = createResource(fetchProfile);

  return (
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
  );
}
