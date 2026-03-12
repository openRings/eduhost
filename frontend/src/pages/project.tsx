import { useParams } from "@solidjs/router";
import { Section } from "../shared/Section";
import {
  ArrowRightLeft,
  Book,
  Clipboard,
  CloudDownload,
  CloudSync,
  CodeXml,
  Database,
  DatabaseZap,
  Dices,
  EthernetPort,
  ExternalLink,
  Eye,
  FolderSearch,
  FolderSymlink,
  FolderTree,
  GitBranch,
  Github,
  Globe,
  IdCard,
  Info,
  KeyRound,
  LockKeyhole,
  PanelsTopLeft,
  Pencil,
  Settings,
  Tag,
  User,
  UserCog,
  UserPlus,
  Users,
  UserStar,
} from "lucide-solid";
import { createResource } from "solid-js";
import { fetchProject } from "../entities/projects";
import { Button } from "../shared/uikit/Button";
import { ReadonlyField } from "../components/ReadonlyField";
import { DiskUsageSection } from "../features/DiskUsageSection";
import { Field } from "../shared/Field";
import { Input } from "../shared/uikit/Input";

export default function () {
  const params = useParams();
  const [project] = createResource(() => params.id, fetchProject);

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
          <Field>
            <Field.Label icon={<FolderSymlink />}>
              Источник файлов сайта
            </Field.Label>
            <Field.Select
              items={[
                { label: "GitHub репозиторий", value: "GitHub" },
                { label: "ZIP архив", value: "Zip" },
              ]}
              defaultValue="GitHub"
            />
          </Field>
          <Field>
            <Field.Label icon={<GitBranch />}>Ветка репозитория</Field.Label>
            <Field.Select
              items={[
                { label: "master", value: "master" },
                { label: "feature/cart", value: "feature/cart" },
              ]}
              defaultValue="master"
            />
          </Field>
          <ReadonlyField
            label="Последняя синхронизация файлов"
            icon={<CloudSync />}
            value="34 мин. назад"
          />
          <Field>
            <Field.Label icon={<Github />}>Github репозиторий</Field.Label>
            <Field.Control>
              <Field.Input value="magwoo/sandaly-shop" readonly />
              <Field.Button iconStart={<Pencil />} />
              <Field.Button iconStart={<ExternalLink />} href="#" />
            </Field.Control>
          </Field>
          <Field>
            <Field.Label icon={<FolderTree />}>Корневая директория</Field.Label>
            <Field.Select
              items={[
                { label: "/", value: "/" },
                { label: "/cart", value: "/cart" },
                { label: "/catalog", value: "/catalog" },
                { label: "/profile", value: "/profile" },
                { label: "/auth", value: "/auth" },
              ]}
              defaultValue="/"
            />
          </Field>
        </div>
        <div class="gap-md flex">
          <Button iconStart={<CloudDownload />} variant="primary">
            Синхронизировать файлы
          </Button>
          <Button iconStart={<FolderSearch />}>Посмотреть файлы</Button>
          <Button iconStart={<ExternalLink />}>Открыть репозиторий</Button>
        </div>
      </Section>
      <Section label="База данных" labelIcon={<Database />}>
        <div class="gap-y-xl gap-x-3xl grid grid-cols-3">
          <Field>
            <Field.Label icon={<DatabaseZap />}>Тип базы данных</Field.Label>
            <Field.Select
              items={[{ label: "MySQL", value: "MySql" }]}
              defaultValue="MySql"
            />
          </Field>
          <Field>
            <Field.Label icon={<Tag />}>Название базы данных</Field.Label>
            <Field.Control>
              <Field.Input value="sandaly" readonly />
              <Field.Button iconStart={<Clipboard />} />
              <Field.Button iconStart={<Pencil />} />
            </Field.Control>
          </Field>
          <Field>
            <Field.Label icon={<Globe />}>Адрес хоста</Field.Label>
            <Field.Control>
              <Field.Input value="db.edukip.ru" readonly />
              <Field.Button iconStart={<Clipboard />} />
            </Field.Control>
          </Field>
          <Field>
            <Field.Label icon={<User />}>Имя пользователя</Field.Label>
            <Field.Control>
              <Field.Input value="magwoo" readonly />
              <Field.Button iconStart={<Clipboard />} />
            </Field.Control>
          </Field>
          <Field>
            <Field.Label icon={<KeyRound />}>Пароль</Field.Label>
            <Field.Control>
              <Field.Input value="****************" readonly />
              <Field.Button iconStart={<Clipboard />} />
              <Field.Button iconStart={<Dices />} />
              <Field.Button iconStart={<Eye />} />
            </Field.Control>
          </Field>
          <Field>
            <Field.Label icon={<EthernetPort />}>Порт</Field.Label>
            <Field.Control>
              <Field.Input value="3306" readonly />
              <Field.Button iconStart={<Clipboard />} />
            </Field.Control>
          </Field>
        </div>
        <div class="p-md gap-md flex flex-col rounded-md bg-neutral-200">
          <div class="gap-xs flex text-neutral-500">
            <LockKeyhole />
            <span>Строка подключения</span>
          </div>
          <div class="gap-xs flex">
            <Input
              value="**************************************************"
              containerClass="grow"
              readonly
            />
            <Button iconStart={<Clipboard />}>Скопировать</Button>
            <Button iconStart={<Eye />}>Показать</Button>
          </div>
        </div>
      </Section>
      <DiskUsageSection diskUsage={() => project()?.diskUsage} />
      <Section labelIcon={<Users />} label="Совместный доступ">
        <p class="max-w-1/2 leading-[150%] text-neutral-500">
          Совместный доступ к проекту для группы студентов
        </p>
        <div class="gap-md flex">
          <Button variant="primary" iconStart={<UserPlus />}>
            Добавить пользователя
          </Button>
          <Button iconStart={<UserCog />}>Управлять правами</Button>
        </div>
        <div class="gap-sm flex flex-col rounded-md bg-linear-to-t from-neutral-100 to-white p-4 ring-1 ring-neutral-300 ring-inset">
          <div class="gap-xl flex p-2 pt-1 text-neutral-500">
            <span class="flex-2">ФИО</span>
            <span class="flex-1">Юзернейм</span>
            <span class="flex-1 text-end">Статус</span>
          </div>
          <div class="gap-xl flex border-t border-neutral-300 p-2">
            <span class="flex-2">
              Борисов Борис Борисович <i class="text-neutral-500">(Вы)</i>
            </span>
            <span class="flex-1">boris</span>
            <span class="flex-1 text-end">Владелец</span>
          </div>
          <div class="gap-xl flex border-t border-neutral-300 p-2">
            <span class="flex-2">Борисов Борис Борисович</span>
            <span class="flex-1">boris</span>
            <span class="flex-1 text-end">Участник</span>
          </div>
        </div>
      </Section>
    </>
  );
}
