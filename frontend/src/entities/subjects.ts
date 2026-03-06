import { fetchApi } from "../utils/api";

export type Subject = {
  id: string;
  name: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    patronymic?: string;
  };
  diskUsage: {
    filesUsageBytes: number;
    databaseUsageBytes: number;
    avaliableBytes: number;
  };
};

export async function fetchSubjects(groupId: string) {
  const { body } = await fetchApi<Subject[]>("/subjects", {
    query: { groupId },
  });

  return body;
}
