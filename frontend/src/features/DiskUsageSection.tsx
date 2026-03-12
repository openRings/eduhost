import {
  Database,
  Diameter,
  FileIcon,
  FileUp,
  HardDrive,
  PanelsTopLeft,
} from "lucide-solid";
import { For, Suspense } from "solid-js";
import type { ProjectDetails } from "../entities/projects";
import { VolumeCategoryCard } from "../components/VolumeCategoryCard";
import { Section } from "../shared/Section";
import { Skeleton } from "../shared/Skeleton";

export type DiskUsageSectionProps = {
  diskUsage: () => ProjectDetails["diskUsage"] | undefined;
};

type DiskUsageContentProps = {
  diskUsage: ProjectDetails["diskUsage"];
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function DiskUsageSectionSkeleton() {
  return (
    <>
      <Skeleton class="h-5 w-full" radius="sm" />
      <div class="gap-md flex">
        <For each={Array.from({ length: 5 })}>
          {() => <Skeleton class="h-20 flex-1" radius="md" />}
        </For>
      </div>
    </>
  );
}

function DiskUsageContent(props: DiskUsageContentProps) {
  const totalDiskBytes = () => Math.max(props.diskUsage.avaliableBytes ?? 0, 0);
  const fileDiskBytes = () => Math.max(props.diskUsage.filesBytes ?? 0, 0);
  const databaseDiskBytes = () =>
    Math.max(props.diskUsage.databaseBytes ?? 0, 0);
  const otherProjectsDiskBytes = () =>
    Math.max(props.diskUsage.otherProjectsBytes ?? 0, 0);
  const freeDiskBytes = () =>
    Math.max(
      totalDiskBytes() -
        fileDiskBytes() -
        databaseDiskBytes() -
        otherProjectsDiskBytes(),
      0,
    );
  const diskPercent = (value: number) =>
    totalDiskBytes() > 0 ? (value / totalDiskBytes()) * 100 : 0;

  return (
    <>
      <div class="flex h-5 w-full overflow-hidden rounded-sm bg-neutral-200 ring-1 ring-neutral-300">
        <div
          class="h-full bg-blue-500"
          style={{ width: `${diskPercent(fileDiskBytes())}%` }}
        />
        <div
          class="h-full bg-green-500"
          style={{ width: `${diskPercent(databaseDiskBytes())}%` }}
        />
        <div
          class="h-full [background-image:repeating-linear-gradient(-45deg,transparent,transparent_2.5px,currentColor_1.5px,currentColor_4px)] text-neutral-400 ring-1 ring-neutral-400 ring-inset"
          style={{ width: `${diskPercent(otherProjectsDiskBytes())}%` }}
        />
      </div>
      <div class="gap-md flex">
        <VolumeCategoryCard
          labelIcon={<Diameter />}
          label="Доступно"
          bytes={totalDiskBytes()}
          percentLabel="100%"
        />
        <VolumeCategoryCard
          labelIcon={<FileIcon />}
          label="Файлы проекта"
          badgeClass="bg-blue-500/10 text-blue-500 ring-0"
          bytes={fileDiskBytes()}
          percentLabel={formatPercent(diskPercent(fileDiskBytes()))}
        />
        <VolumeCategoryCard
          labelIcon={<Database />}
          label="База данных проекта"
          badgeClass="bg-green-500/10 text-green-500 ring-0"
          bytes={databaseDiskBytes()}
          percentLabel={formatPercent(diskPercent(databaseDiskBytes()))}
        />
        <VolumeCategoryCard
          labelIcon={<PanelsTopLeft class="text-neutral-700" />}
          label={<span class="text-neutral-700">Другие проекты</span>}
          badgeClass="[background-image:repeating-linear-gradient(-45deg,transparent,transparent_2.5px,currentColor_1.5px,currentColor_4px)] ring-neutral-400 text-neutral-400/40"
          bytes={otherProjectsDiskBytes()}
          percentLabel={formatPercent(diskPercent(otherProjectsDiskBytes()))}
        />
        <VolumeCategoryCard
          labelIcon={<FileUp />}
          label="Свободно"
          badgeClass="bg-transparent ring-0 p-0"
          bytes={freeDiskBytes()}
          percentLabel={formatPercent(diskPercent(freeDiskBytes()))}
        />
      </div>
    </>
  );
}

export function DiskUsageSection(props: DiskUsageSectionProps) {
  return (
    <Section label="Использование диска" labelIcon={<HardDrive />}>
      <p class="max-w-1/2 leading-[150%] text-neutral-500">
        Статистика использования диска в текущем проекте относительно всего
        выделенного пространства на проекты от предмета
      </p>
      <Suspense fallback={<DiskUsageSectionSkeleton />}>
        {(() => {
          const diskUsage = props.diskUsage();
          return diskUsage ? <DiskUsageContent diskUsage={diskUsage} /> : null;
        })()}
      </Suspense>
    </Section>
  );
}
