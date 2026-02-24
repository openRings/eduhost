import { HTMLArkProps } from "@ark-ui/solid";

import { JSX, Show } from "solid-js";

export type FieldProps = HTMLArkProps<"div"> & {
  icon?: JSX.Element;
  description?: string;
  optional?: boolean;
  message?: string;
  error?: string;
};

export function Field(props: FieldProps) {
  return (
    <div class="pl-md flex w-full border-l border-neutral-300 text-neutral-500">
      <div class="gap-md flex w-full flex-col">
        <div class="gap-xs flex items-center">
          {props.icon}
          <label>{props.description}</label>
          <Show when={props.optional == true}>
            <span class="text-[10px]">(не обязательно)</span>
          </Show>
        </div>
        {props.children}
        <Show when={props.error}>
          <p class="text-error-300">{props.error}</p>
        </Show>
      </div>
    </div>
  );
}
