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

export type IsProjectAliasAvailableResponse = {
  isAvailable: boolean;
};

export type CreateProjectBody = {
  name: string;
  alias: string;
  groupId: string;
  subjectId: string;
};

export type CreateProjectResponse = {
  id: string;
};

export type ProjectUser = {
  id: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
};

export type ProjectSubject = {
  id: string;
  name: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    patronymic?: string;
  };
};

export type ProjectSource = {
  sourceType: string;
  link: string;
  currentBranch: string;
  branches: {
    id: string;
    name: string;
    isExists: boolean;
  }[];
  rootDir: string;
  sizeBytes: number;
};

export type ProjectDatabase = {
  id: string;
  name: string;
  password: string;
  diskUsageBytes: number;
};

export type ProjectDetails = {
  id: string;
  name: string;
  label: string;
  subject: ProjectSubject;
  owner: ProjectUser;
  users: ProjectUser[];
  source?: ProjectSource;
  database?: ProjectDatabase;
  diskUsage: {
    avaliableBytes: number;
    filesBytes: number;
    databaseBytes: number;
    otherProjectsBytes: number;
  };
};

export async function fetchProjects(query: FetchProjectsQuery) {
  const { body } = await fetchApi<SubjectProjects[]>("/projects", {
    query: Object.fromEntries(
      Object.entries(query).filter(([_key, value]) => !!value),
    ) as Record<string, string>,
  });

  return body;
}

export async function fetchProject(projectId: string) {
  const { body } = await fetchApi<ProjectDetails>(`/projects/${projectId}`);

  return body;
}

export async function checkProjectAliasAvailability(alias: string) {
  const { status, body } = await fetchApi<IsProjectAliasAvailableResponse>(
    "/projects/alias/available",
    {
      method: "POST",
      body: { alias },
    },
  );

  if (status != 200) return false;

  return body.isAvailable;
}

export async function createProject(body: CreateProjectBody) {
  return fetchApi<CreateProjectResponse>("/projects", {
    method: "POST",
    body,
  });
}
