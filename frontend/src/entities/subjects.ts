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

export async function fetchSubjects() {
  const { body } = await fetchApi<Subject[]>("/subjects");

  return body;
}
