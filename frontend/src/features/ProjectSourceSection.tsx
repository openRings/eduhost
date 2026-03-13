import {
  CloudDownload,
  CloudSync,
  CodeXml,
  ExternalLink,
  FolderSearch,
  FolderSymlink,
  FolderTree,
  GitBranch,
  Github,
} from "lucide-solid";
import type { JSX } from "solid-js";
import type { ProjectDetails } from "../entities/projects";
import { ReadonlyField } from "../components/ReadonlyField";
import { Field } from "../shared/Field";
import { Section } from "../shared/Section";
import { Skeleton } from "../shared/Skeleton";
import { Button } from "../shared/uikit/Button";

export type ProjectSourceSectionProps = {
  project?: ProjectDetails;
  isLoading: boolean;
};

function FieldSkeleton(props: { icon: JSX.Element; label: string }) {
  return (
    <Field>
      <Field.Label icon={props.icon}>{props.label}</Field.Label>
      <Skeleton class="h-8 w-full" radius="sm" />
    </Field>
  );
}

function sourceTypeLabel(sourceType?: string) {
  if (sourceType === "github" || sourceType === "GitHub")
    return "GitHub репозиторий";
  if (sourceType === "zip" || sourceType === "Zip") return "ZIP архив";
  return sourceType ?? "";
}

function sourceBranchItems(project?: ProjectDetails) {
  const source = project?.source;
  if (!source) return [];

  if (source.branches.length > 0) {
    return source.branches.map((branch) => ({
      label: branch.name,
      value: branch.name,
    }));
  }

  if (!source.branch) return [];

  return [{ label: source.branch, value: source.branch }];
}

function selectedBranchValue(project?: ProjectDetails) {
  const source = project?.source;
  if (!source) return "";

  return source.selectedBranch || source.branch || "";
}

export function ProjectSourceSection(props: ProjectSourceSectionProps) {
  return (
    <Section label="Исходный код" labelIcon={<CodeXml />}>
      <p class="text-neutral-500">
        Настройки источника исходных файлов проекта
      </p>
      <div class="gap-x-3xl gap-y-xl grid grid-cols-3">
        {props.isLoading ? (
          <FieldSkeleton
            icon={<FolderSymlink />}
            label="Источник файлов сайта"
          />
        ) : (
          <Field>
            <Field.Label icon={<FolderSymlink />}>
              Источник файлов сайта
            </Field.Label>
            <Field.Select
              items={[
                {
                  label: sourceTypeLabel(props.project?.source?.sourceType),
                  value: props.project?.source?.sourceType ?? "",
                },
              ]}
              value={props.project?.source?.sourceType ?? ""}
            />
          </Field>
        )}
        {props.isLoading ? (
          <FieldSkeleton icon={<GitBranch />} label="Ветка репозитория" />
        ) : (
          <Field>
            <Field.Label icon={<GitBranch />}>Ветка репозитория</Field.Label>
            <Field.Select
              items={sourceBranchItems(props.project)}
              defaultValue={selectedBranchValue(props.project)}
            />
          </Field>
        )}
        <ReadonlyField
          label="Последняя синхронизация файлов"
          icon={<CloudSync />}
          value=""
          isLoading={props.isLoading}
        />
        <ReadonlyField
          label="Github репозиторий"
          icon={<Github />}
          value={props.project?.source?.link}
          isLoading={props.isLoading}
        />
        {props.isLoading ? (
          <FieldSkeleton icon={<FolderTree />} label="Корневая директория" />
        ) : (
          <Field>
            <Field.Label icon={<FolderTree />}>Корневая директория</Field.Label>
            <Field.Control>
              <Field.Input
                value={props.project?.source?.rootDir ?? ""}
                readonly
              />
            </Field.Control>
          </Field>
        )}
      </div>
      <div class="gap-md flex">
        <Button iconStart={<CloudDownload />} variant="primary">
          Синхронизировать файлы
        </Button>
        <Button iconStart={<FolderSearch />}>Посмотреть файлы</Button>
        <Button iconStart={<ExternalLink />}>Открыть репозиторий</Button>
      </div>
    </Section>
  );
}
