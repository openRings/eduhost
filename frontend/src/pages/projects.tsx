import { createMemo, createResource, createSignal } from "solid-js";
import { fetchProjects } from "../entities/projects";
import { currentGroupId } from "../utils/group";
import { ProjectsFiltersSection } from "../features/ProjectsFiltersSection";
import { ProjectsSubjectsSection } from "../features/ProjectsSubjectsSection";

export default function () {
  const [query, setQuery] = createSignal("");
  const [selectedSubjectId, setSelectedSubjectId] = createSignal("");
  const [allSubjects] = createResource(currentGroupId, (groupId) =>
    fetchProjects({ groupId }),
  );

  const projectsQuery = createMemo(() => ({
    groupId: currentGroupId(),
    query: query().trim() || undefined,
    subjectId: selectedSubjectId() || undefined,
  }));

  const [subjects] = createResource(projectsQuery, fetchProjects);

  const subjectItems = () =>
    (allSubjects() ?? []).map((subject) => ({
      value: subject.id,
      label: subject.name,
    }));

  return (
    <>
      <ProjectsFiltersSection
        query={query()}
        onQueryInput={setQuery}
        selectedSubjectId={selectedSubjectId()}
        onSubjectSelect={(subjectId) => setSelectedSubjectId(subjectId)}
        subjectItems={subjectItems()}
        isSubjectsLoading={allSubjects.loading}
        onClear={() => {
          setQuery("");
          setSelectedSubjectId("");
        }}
      />
      <ProjectsSubjectsSection
        subjects={subjects() ?? []}
        isLoading={subjects.loading}
      />
    </>
  );
}
