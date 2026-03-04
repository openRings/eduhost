import { Database, ExternalLink, HardDrive } from "lucide-solid";
import { Show } from "solid-js";
import { Block } from "../shared/Block";
import { Label } from "../shared/uikit/Label";
import { Volume } from "../shared/Volume";
import type { Subject } from "../entities/subjects";

export type SubjectCardProps = {
  subject: Subject;
};

const percentFromTotal = (value: number, total: number) =>
  Math.min(100, Math.round(total > 0 ? (value / total) * 100 : 0));

export function SubjectCard(props: SubjectCardProps) {
  const total = props.subject.diskUsage.avaliableBytes;
  const files = props.subject.diskUsage.filesUsageBytes;
  const database = props.subject.diskUsage.databaseUsageBytes;
  const used = files + database;

  const usedPercent = percentFromTotal(used, total);
  const filesPercent = percentFromTotal(files, total);
  const databasePercent = percentFromTotal(database, total);

  return (
    <Block
      title={props.subject.name}
      label={
        <>
          <div class="flex">
            <span class="min-w-0 flex-1 truncate">{props.subject.name}</span>
          </div>
          <span class="text-neutral-500 underline">
            {props.subject.teacher.lastName} {props.subject.teacher.firstName}{" "}
            <Show when={props.subject.teacher.patronymic}>
              {props.subject.teacher.patronymic}
            </Show>
          </span>
        </>
      }
      icon={<ExternalLink class="min-w-3.5" />}
    >
      <div class="gap-2xl flex">
        <div class="gap-sm flex flex-1 flex-col">
          <div class="gap-x-xl gap-y-md flex flex-wrap items-center">
            <div class="gap-sm flex flex-col">
              <Label icon={<HardDrive />}>Файлы</Label>
              <span>
                <Volume bytes={files} />{" "}
                <span class="text-neutral-500">({filesPercent}%)</span>
              </span>
            </div>
            <div class="w-0.5 self-stretch rounded-full bg-neutral-300" />
            <div class="gap-sm flex flex-col">
              <Label icon={<Database />}>База данных</Label>
              <span>
                <Volume bytes={database} />{" "}
                <span class="text-neutral-500">({databasePercent}%)</span>
              </span>
            </div>
            <div class="w-0.5 self-stretch rounded-full bg-neutral-300" />
            <div class="gap-sm flex flex-col">
              <Label icon={<HardDrive />}>Всего</Label>
              <span>
                <Volume bytes={total} />{" "}
                <span class="text-neutral-500">(100%)</span>
              </span>
            </div>
          </div>
          <div class="h-1 w-full rounded-full bg-neutral-300">
            <div
              class="bg-warning-300 h-full rounded-full"
              style={{ width: `${usedPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Block>
  );
}
