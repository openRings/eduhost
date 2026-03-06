import { createSignal } from "solid-js";

const [hiddenMap, setHiddenMap] = createSignal<Record<string, boolean>>({});

export function isHidden(key: string) {
  return hiddenMap()[key] === true;
}

export function hide(key: string) {
  setHiddenMap((prev) => ({ ...prev, [key]: true }));
}

export function show(key: string) {
  setHiddenMap((prev) => {
    const next = { ...prev };
    delete next[key];
    return next;
  });
}
