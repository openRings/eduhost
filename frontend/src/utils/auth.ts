import { createEffect, createSignal } from "solid-js";
import { isDev } from "solid-js/web";

type RefreshSessionResponse = {
  token: string;
};

const [accessToken, setAccessToken] = createSignal<string | undefined>(
  undefined,
);
const [isAuthorized, setIsAuthorized] = createSignal(
  !!localStorage.getItem("isAuthorized"),
);

export const currentAccessToken = () => accessToken();
export const logout = () => setIsAuthorized(false);
export { isAuthorized };

createEffect(() => {
  isAuthorized()
    ? localStorage.setItem("isAuthorized", "true")
    : localStorage.removeItem("isAuthorized");
});

let lock: undefined | Promise<any> = undefined;

export async function refreshSession(authRedirect?: boolean) {
  if (lock != undefined) {
    await lock;
    return;
  }

  let unlock: undefined | ((v: any) => void) = undefined;
  lock = new Promise((resolve) => (unlock = resolve));

  const response = await fetch("/api/auth/refresh", { method: "POST" });

  if (isDev) await new Promise((r) => setTimeout(r, Math.random() * 150));

  if (!response.ok) {
    setIsAuthorized(false);
    authRedirect && window.location.assign("/signin");
  }

  const responseBody: RefreshSessionResponse = await response.json();

  setAccessToken(responseBody.token);
  setIsAuthorized(true);

  unlock!(undefined);
  lock = undefined;
}
