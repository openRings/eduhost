import { JSX, onCleanup, onMount, Show } from "solid-js";
import { hide, isHidden, show } from "../utils/hide";

export type HideProps = {
  key: string;
  children: JSX.Element;
};

export function Hide(props: HideProps) {
  return <Show when={!isHidden(props.key)}>{props.children}</Show>;
}

export type HideControllerProps = {
  keys: string | string[];
};

export function HideController(props: HideControllerProps) {
  const keys = () => (Array.isArray(props.keys) ? props.keys : [props.keys]);

  onMount(() => {
    keys().forEach(hide);
  });

  onCleanup(() => {
    keys().forEach(show);
  });

  return null;
}
