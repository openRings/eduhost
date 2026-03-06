import { createEffect, createSignal } from "solid-js";

const selectedGroupStorageKey = "selectedGroupId";

const [selectedGroupId, setSelectedGroupId] = createSignal<string | undefined>(
  localStorage.getItem(selectedGroupStorageKey) ?? undefined,
);

export const currentGroupId = () => {
  const groupId = selectedGroupId();
  const isAuthPage =
    window.location.pathname === "/signin" ||
    window.location.pathname === "/signup";

  if (groupId) return groupId;

  if (window.location.pathname !== "/group-select" && !isAuthPage) {
    window.location.assign("/group-select");
  }

  return "";
};

export function setCurrentGroupId(groupId: string) {
  setSelectedGroupId(groupId);
}

export function resetCurrentGroupId() {
  setSelectedGroupId(undefined);
}

createEffect(() => {
  const groupId = selectedGroupId();

  if (groupId) {
    localStorage.setItem(selectedGroupStorageKey, groupId);
    return;
  }

  localStorage.removeItem(selectedGroupStorageKey);
});
