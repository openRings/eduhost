import { createEffect, createSignal } from "solid-js";

const selectedGroupStorageKey = "selectedGroupId";

const [selectedGroupId, setSelectedGroupId] = createSignal<string | undefined>(
  localStorage.getItem(selectedGroupStorageKey) ?? undefined,
);

export const currentGroupId = () => selectedGroupId();

export function setCurrentGroupId(groupId: string) {
  setSelectedGroupId(groupId);
}

createEffect(() => {
  const groupId = selectedGroupId();

  if (groupId) {
    localStorage.setItem(selectedGroupStorageKey, groupId);
    return;
  }

  localStorage.removeItem(selectedGroupStorageKey);
});
