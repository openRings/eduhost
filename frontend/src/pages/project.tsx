import { useParams } from "@solidjs/router";
import { Section } from "../shared/Section";

export default function () {
  const params = useParams();

  return (
    <Section label="Проект">
      <span>ID проекта: {params.id}</span>
    </Section>
  );
}
