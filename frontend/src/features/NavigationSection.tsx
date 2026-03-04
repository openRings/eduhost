import { BookOpen, Database, Map, PanelsTopLeft } from "lucide-solid";
import { NavigationCard } from "../components/NavigationCard";
import { Section } from "../shared/Section";

export type NavigationSectionProps = {};

export function NavigationSection(_props: NavigationSectionProps) {
  return (
    <Section labelIcon={<Map />} label="Навигация">
      <div class="gap-md grid grid-cols-3">
        <NavigationCard
          href="/projects"
          title="Проекты"
          description="Ваши предметы и проекты"
          icon={<PanelsTopLeft />}
        />
        <NavigationCard
          href="/databases"
          title="Базы данных"
          description="Ваши базы данных"
          icon={<Database />}
        />
        <NavigationCard
          href="/guides"
          title="Гайды"
          description="Как пользоваться сервисом"
          icon={<BookOpen />}
        />
      </div>
    </Section>
  );
}
