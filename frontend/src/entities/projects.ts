import { fetchApi } from "../utils/api";

export type ProjectBySubject = {
  id: string;
  name: string;
  alias: string;
  diskUsage: {
    fileBytes: number;
    databaseBytes: number;
  };
};

export type SubjectProjects = {
  id: string;
  name: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    patronymic?: string;
  };
  diskUsage: {
    usedBytes: number;
    avaliableBytes: number;
  };
  projects: ProjectBySubject[];
};

export type FetchProjectsQuery = {
  groupId: string;
  query?: string;
  subjectId?: string;
};

export async function fetchProjects(query: FetchProjectsQuery) {
  const { body } = await fetchApi<SubjectProjects[]>("/projects", {
    query: Object.fromEntries(
      Object.entries(query).filter(([_key, value]) => !!value),
    ) as Record<string, string>,
  });

  return body;
}
