import { ExternalLink } from "lucide-solid";
import { Block } from "../shared/Block";
import { Skeleton } from "../shared/Skeleton";
import { Volume } from "../shared/Volume";
import { Suspense } from "solid-js";

export type AccountUsageCardProps = {
  usedBytes: number | undefined;
  avaliableBytes: number | undefined;
};

export function AccountUsageCard(props: AccountUsageCardProps) {
  const percent = () => {
    const used = props.usedBytes ?? 0;
    const available = props.avaliableBytes ?? 0;
    const value = available > 0 ? Math.round((used / available) * 100) : 0;

    return Math.min(100, value);
  };

  return (
    <Block
      title="Подробнее"
      class="col-span-2 h-32"
      icon={<ExternalLink />}
      label={
        <div class="gap-md flex text-2xl text-neutral-700">
          <Suspense fallback={<Skeleton class="h-7 w-48" />}>
            <Volume
              bytes={props.usedBytes ?? 0}
              valueClass="text-2xl text-neutral-700"
              unitClass="text-sm text-neutral-500"
            />{" "}
            /{" "}
            <Volume
              bytes={props.avaliableBytes ?? 0}
              valueClass="text-2xl text-neutral-700"
              unitClass="text-sm text-neutral-500"
            />
            <span class="text-neutral-500">({percent()}%)</span>
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
            style={{ width: `${percent()}%` }}
          />
        </div>
      </div>
    </Block>
  );
}
