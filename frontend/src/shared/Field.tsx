import { JSX, splitProps } from "solid-js";
import { Field as ArkField } from "@ark-ui/solid";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { Input, InputProps } from "./uikit/Input";

const baseRootClass =
  "flex flex-col gap-md pl-md border-l border-neutral-300 items-start";

export type FieldProps = InputProps & {
  containerClass?: string;
  error?: JSX.Element;
  icon?: JSX.Element;
  label?: JSX.Element;
};

export function Field(props: FieldProps) {
  const [_, attrs] = splitProps(props, [
    "icon",
    "label",
    "containerClass",
    "error",
  ]);

  const rootClasses = () => twMerge(clsx(baseRootClass, props.containerClass));

  return (
    <ArkField.Root class={rootClasses()} invalid={!!props.error}>
      <ArkField.Label class="gap-xs flex text-neutral-500">
        {props.icon}
        {props.label}
      </ArkField.Label>
      <Input {...attrs} containerClass="w-full" />
      <ArkField.ErrorText class="text-error-300">
        {props.error}
      </ArkField.ErrorText>
    </ArkField.Root>
  );
}
