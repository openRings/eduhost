import { fetchApi } from "../utils/api";
import type { AccessLevel } from "./session";

export type Profile = {
  username: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  access: AccessLevel;
};

export type AccountMetrics = {
  diskUsage: {
    usedBytes: number;
    avaliableBytes: number;
  };
  projectCount: number;
  subjectCount: number;
};

export async function fetchProfile() {
  const { body } = await fetchApi<Profile>("/profile");

  return body;
}

export async function fetchAccountMetrics(groupId: string) {
  const { body } = await fetchApi<AccountMetrics>("/profile/metrics", {
    query: { groupId },
  });

  return body;
}
