import { createSignal, JSX, Show, splitProps } from "solid-js";
import { Field as ArkField } from "@ark-ui/solid";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { Input, InputProps } from "./uikit/Input";
import { Button } from "./uikit/Button";
import { Clipboard, Eye } from "lucide-solid";
import { copyToClipboard } from "../utils/clipboard";

const baseRootClass =
  "flex flex-col gap-md pl-md border-l border-neutral-300 items-start";

export type FieldProps = InputProps & {
  containerClass?: string;
  copyable?: boolean;
  error?: JSX.Element;
  icon?: JSX.Element;
  label?: JSX.Element;
};

export function Field(props: FieldProps) {
  const [_, attrs] = splitProps(props, [
    "icon",
    "label",
    "copyable",
    "containerClass",
    "error",
    "type",
  ]);

  const [isHide, setIsHide] = createSignal(true);

  const rootClasses = () => twMerge(clsx(baseRootClass, props.containerClass));

  let inputElement: HTMLInputElement | undefined = undefined;

  return (
    <ArkField.Root class={rootClasses()} invalid={!!props.error}>
      <ArkField.Label class="gap-xs flex text-neutral-500">
        {props.icon}
        {props.label}
      </ArkField.Label>
      <div class="gap-xs flex w-full">
        <Input
          {...attrs}
          ref={inputElement}
          type={isHide() ? props.type : "text"}
          containerClass="grow"
        />
        <Show when={props.copyable}>
          <Button
            onclick={() => copyToClipboard(inputElement!.value)}
            iconStart={<Clipboard />}
            size="md"
          />
        </Show>
        {props.children}
        <Show when={props.type === "password"}>
          <Button
            onmousedown={() => setIsHide(false)}
            onmouseup={() => setIsHide(true)}
            onmouseleave={() => setIsHide(true)}
            iconStart={<Eye />}
            size="md"
          />
        </Show>
      </div>
      <ArkField.ErrorText class="text-error-300">
        {props.error}
      </ArkField.ErrorText>
    </ArkField.Root>
  );
}
