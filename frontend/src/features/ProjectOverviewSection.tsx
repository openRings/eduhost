import {
  ArrowRightLeft,
  ExternalLink,
  Globe,
  IdCard,
  PanelsTopLeft,
  Settings,
  Tag,
  Users,
  UserStar,
} from "lucide-solid";
import type { ProjectDetails } from "../entities/projects";
import { ReadonlyField } from "../components/ReadonlyField";
import { Section } from "../shared/Section";
import { Button } from "../shared/uikit/Button";

export type ProjectOverviewSectionProps = {
  project?: ProjectDetails;
  isLoading: boolean;
};

function ownerName(project?: ProjectDetails) {
  const owner = project?.owner;
  if (!owner) return "";

  return `${owner.lastName} ${owner.firstName}${owner.patronymic ? ` ${owner.patronymic}` : ""}`;
}

export function ProjectOverviewSection(props: ProjectOverviewSectionProps) {
  return (
    <Section labelIcon={<PanelsTopLeft />} label="Проект">
      <div class="gap-x-3xl gap-y-xl grid grid-cols-3">
        <ReadonlyField
          label="Название проекта"
          icon={<Tag />}
          value={props.project?.name}
          isLoading={props.isLoading}
        />
        <ReadonlyField
          label="Владелец проекта"
          icon={<UserStar />}
          value={ownerName(props.project)}
          isLoading={props.isLoading}
        />
        <ReadonlyField
          label="Публичный адрес сайта"
          icon={<Globe />}
          value=""
          copyable
          isLoading={props.isLoading}
        />
        <ReadonlyField
          label="Уникальный Идентификатор сайта"
          icon={<IdCard />}
          value={props.project?.label}
          copyable
          isLoading={props.isLoading}
        />
        <ReadonlyField
          label="Пользователей в проекте"
          icon={<Users />}
          value={props.project?.users.length?.toString()}
          isLoading={props.isLoading}
        />
      </div>
      <div class="gap-md flex">
        <Button iconStart={<ExternalLink />} variant="primary">
          Открыть в браузере
        </Button>
        <Button iconStart={<ArrowRightLeft />}>
          Перенести в другой предмет
        </Button>
        <Button iconStart={<Settings />}>Настройки</Button>
      </div>
    </Section>
  );
}
