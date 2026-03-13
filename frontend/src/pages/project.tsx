import { useParams } from "@solidjs/router";
import { createResource } from "solid-js";
import { fetchProject } from "../entities/projects";
import { DiskUsageSection } from "../features/DiskUsageSection";
import { ProjectAccessSection } from "../features/ProjectAccessSection";
import { ProjectDatabaseSection } from "../features/ProjectDatabaseSection";
import { ProjectOverviewSection } from "../features/ProjectOverviewSection";
import { ProjectSourceSection } from "../features/ProjectSourceSection";
import { ProjectSubjectSection } from "../features/ProjectSubjectSection";

export default function () {
  const params = useParams();

  const [project] = createResource(() => params.id, fetchProject);

  return (
    <>
      <ProjectSubjectSection project={project()} isLoading={project.loading} />
      <ProjectOverviewSection project={project()} isLoading={project.loading} />
      <ProjectSourceSection project={project()} isLoading={project.loading} />
      <ProjectDatabaseSection project={project()} isLoading={project.loading} />
      <DiskUsageSection diskUsage={() => project()?.diskUsage} />
      <ProjectAccessSection project={project()} isLoading={project.loading} />
    </>
  );
}
