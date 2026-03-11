import { Section } from "../shared/Section";
import {
  ArrowRightLeft,
  Book,
  CodeXml,
  ExternalLink,
  Globe,
  IdCard,
  Info,
  PanelsTopLeft,
  Settings,
  Tag,
  Users,
  UserStar,
} from "lucide-solid";
import { Button } from "../shared/uikit/Button";
import { ReadonlyField } from "../components/ReadonlyField";

export default function () {
  return (
    <>
      <Section class="flex flex-row items-center justify-between">
        <div class="gap-sm flex flex-col">
          <div class="gap-xs flex">
            <Book />
            Проектирование и разработка веб приложений
          </div>
          <span class="text-neutral-500">Пташкин Олег Генрихович</span>
        </div>
        <Button iconStart={<Info />}>Подробнее о предмете</Button>
      </Section>
      <Section labelIcon={<PanelsTopLeft />} label="Проект">
        <div class="gap-x-3xl gap-y-xl grid grid-cols-3">
          <ReadonlyField
            label="Название проекта"
            icon={<Tag />}
            value="Интернет магазин сандалей"
          />
          <ReadonlyField
            label="Владелец проекта"
            icon={<UserStar />}
            value="magwoo (Вы)"
          />
          <ReadonlyField
            label="Публичный адрес сайта"
            icon={<Globe />}
            value="https://sandaly.p.edukip.ru"
            copyable
          />
          <ReadonlyField
            label="Уникальный Идентификатор сайта"
            icon={<IdCard />}
            value="sandaly"
            copyable
          />
          <ReadonlyField
            label="Пользователей в проекте"
            icon={<Users />}
            value="3"
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
      <Section label="Исходный код" labelIcon={<CodeXml />}>
        <p class="text-neutral-500">
          Настройки источника исходных файлов проекта
        </p>
        <div class="gap-x-3xl gap-y-xl grid grid-cols-3">
          <ReadonlyField
            label="Пользователей в проекте"
            icon={<Users />}
            value="3"
          />
        </div>
      </Section>
    </>
  );
}
