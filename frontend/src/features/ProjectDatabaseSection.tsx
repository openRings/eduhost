import {
  Clipboard,
  Database,
  DatabaseZap,
  EthernetPort,
  Eye,
  Globe,
  KeyRound,
  LockKeyhole,
  Tag,
  User,
} from "lucide-solid";
import type { JSX } from "solid-js";
import type { ProjectDetails } from "../entities/projects";
import { ReadonlyField } from "../components/ReadonlyField";
import { Field } from "../shared/Field";
import { Section } from "../shared/Section";
import { Skeleton } from "../shared/Skeleton";
import { Button } from "../shared/uikit/Button";
import { Input } from "../shared/uikit/Input";

export type ProjectDatabaseSectionProps = {
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

export function ProjectDatabaseSection(props: ProjectDatabaseSectionProps) {
  return (
    <Section label="База данных" labelIcon={<Database />}>
      <div class="gap-y-xl gap-x-3xl grid grid-cols-3">
        {props.isLoading ? (
          <FieldSkeleton icon={<DatabaseZap />} label="Тип базы данных" />
        ) : (
          <Field>
            <Field.Label icon={<DatabaseZap />}>Тип базы данных</Field.Label>
            <Field.Select items={[{ label: "", value: "" }]} value="" />
          </Field>
        )}
        <ReadonlyField
          label="Название базы данных"
          icon={<Tag />}
          value={props.project?.database?.name}
          isLoading={props.isLoading}
          copyable
        />
        <ReadonlyField
          label="Адрес хоста"
          icon={<Globe />}
          value=""
          isLoading={props.isLoading}
        />
        <ReadonlyField
          label="Имя пользователя"
          icon={<User />}
          value=""
          isLoading={props.isLoading}
        />
        <ReadonlyField
          label="Пароль"
          icon={<KeyRound />}
          value={props.project?.database?.password}
          isLoading={props.isLoading}
          copyable
        />
        <ReadonlyField
          label="Порт"
          icon={<EthernetPort />}
          value=""
          isLoading={props.isLoading}
        />
      </div>
      <div class="p-md gap-md flex flex-col rounded-md bg-neutral-200">
        <div class="gap-xs flex text-neutral-500">
          <LockKeyhole />
          <span>Строка подключения</span>
        </div>
        <div class="gap-xs flex">
          {props.isLoading ? (
            <Skeleton class="h-8 grow" radius="sm" />
          ) : (
            <Input value="" containerClass="grow" readonly />
          )}
          <Button iconStart={<Clipboard />}>Скопировать</Button>
          <Button iconStart={<Eye />}>Показать</Button>
        </div>
      </div>
    </Section>
  );
}
