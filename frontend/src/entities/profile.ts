import { fetchApi } from "../utils/api";

export type Profile = {
  username: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
};

export async function fetchProfile() {
  const { body } = await fetchApi<Profile>("/profile");

  return body;
}
