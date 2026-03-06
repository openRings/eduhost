import { fetchApi } from "../utils/api";

export type IsUsernameAvailableResponse = {
  isAvailable: boolean;
};

export async function checkUsernameAvailability(username: string) {
  const { status, body } = await fetchApi<IsUsernameAvailableResponse>(
    "/auth/username/available",
    {
      method: "POST",
      authRedirect: false,
      body: { username },
    },
  );

  if (status != 200) return false;

  return body.isAvailable;
}
