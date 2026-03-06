import { fetchApi } from "../utils/api";

export type Group = {
  id: string;
  name: string;
};

export async function fetchGroups() {
  const { body } = await fetchApi<Group[]>("/groups");

  return body;
}
