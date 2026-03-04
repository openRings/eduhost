import { fetchApi } from "../utils/api";

export type Profile = {
  username: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
};

export type AccountMetrics = {
  diskUsage: {
    usedBytes: number;
    avaliableBytes: number;
  };
  projectCount: number;
  groupCount: number;
};

export async function fetchProfile() {
  const { body } = await fetchApi<Profile>("/profile");

  return body;
}

export async function fetchAccountMetrics() {
  const { body } = await fetchApi<AccountMetrics>("/profile/metrics");

  return body;
}
