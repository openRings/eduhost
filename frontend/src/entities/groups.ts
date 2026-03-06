import { fetchApi } from "../utils/api";

export type Group = {
  id: string;
  name: string;
};

export async function fetchGroups() {
  const { body } = await fetchApi<Group[]>("/groups");

  const isAuthPage =
    window.location.pathname === "/signin" ||
    window.location.pathname === "/signup";

  if (
    !body.length &&
    window.location.pathname !== "/group-select" &&
    !isAuthPage
  ) {
    window.location.assign("/group-select");
  }

  return body;
}
