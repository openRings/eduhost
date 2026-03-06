import { ExternalLink, SquareUser } from "lucide-solid";
import { createResource } from "solid-js";
import { AccountCountCard } from "../components/AccountCountCard";
import { AccountUsageCard } from "../components/AccountUsageCard";
import { fetchAccountMetrics } from "../entities/profile";
import { Section } from "../shared/Section";
import { currentGroupId } from "../utils/group";

export type AccountSummarySectionProps = {};

export function AccountSummarySection(_props: AccountSummarySectionProps) {
  const [metrics] = createResource(currentGroupId, fetchAccountMetrics);

  return (
    <Section labelIcon={<SquareUser />} label="Аккаунт">
      <div class="gap-md grid grid-cols-6">
        <AccountUsageCard
          usedBytes={metrics()?.diskUsage.usedBytes}
          avaliableBytes={metrics()?.diskUsage.avaliableBytes}
        />
        <AccountCountCard
          title="Подробнее"
          class="h-32"
          icon={<ExternalLink />}
          count={metrics()?.projectCount}
          label="Всего проектов"
        />
        <AccountCountCard
          class="h-32"
          count={metrics()?.subjectCount}
          label="Всего предметов"
        />
      </div>
    </Section>
  );
}
