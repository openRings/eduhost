import { AccountHeaderSection } from "../features/AccountHeaderSection";
import { SubjectsSection } from "../features/SubjectsSection";
import { AccountSummarySection } from "../features/AccountSummarySection";
import { NavigationSection } from "../features/NavigationSection";

export default function () {
  return (
    <>
      <AccountHeaderSection />
      <AccountSummarySection />
      <NavigationSection />
      <SubjectsSection />
    </>
  );
}
