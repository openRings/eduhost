import { Field as ArkField, HTMLArkProps } from "@ark-ui/solid";
import clsx from "clsx";
import { Clipboard, Eye } from "lucide-solid";
import { createSignal, JSX, Show, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { copyToClipboard } from "../utils/clipboard";
import { Button } from "./uikit/Button";
import { Input, InputProps } from "./uikit/Input";
import { Select, SelectProps } from "./uikit/Select";

const baseRootClass =
  "flex w-full flex-col gap-md border-l border-neutral-300 pl-md items-stretch";

const baseLabelClass = "gap-xs flex text-neutral-500";
const baseControlClass = "gap-xs flex w-full";
const baseErrorClass = "text-error-300";

export type FieldProps = HTMLArkProps<"div"> & {
  containerClass?: string;
  invalid?: boolean;
};

export type FieldLabelProps = HTMLArkProps<"label"> & {
  icon?: JSX.Element;
};

export type FieldControlProps = HTMLArkProps<"div">;

export type FieldErrorProps = HTMLArkProps<"span">;

export type FieldInputProps = InputProps & {
  copyable?: boolean;
};

export type FieldSelectProps = SelectProps;

type FieldComponent = ((props: FieldProps) => JSX.Element) & {
  Label: (props: FieldLabelProps) => JSX.Element;
  Control: (props: FieldControlProps) => JSX.Element;
  Input: (props: FieldInputProps) => JSX.Element;
  Select: (props: FieldSelectProps) => JSX.Element;
  Error: (props: FieldErrorProps) => JSX.Element;
};

export const Field = ((props: FieldProps) => {
  const [_, attrs] = splitProps(props, ["containerClass", "class"]);

  const classes = () =>
    twMerge(clsx(baseRootClass, props.containerClass, props.class));

  return (
    <ArkField.Root {...attrs} class={classes()}>
      {props.children}
    </ArkField.Root>
  );
}) as FieldComponent;

function FieldLabel(props: FieldLabelProps) {
  const [_, attrs] = splitProps(props, ["icon", "class"]);

  const classes = () => twMerge(clsx(baseLabelClass, props.class));

  return (
    <ArkField.Label {...attrs} class={classes()}>
      {props.icon}
      {props.children}
    </ArkField.Label>
  );
}

function FieldControl(props: FieldControlProps) {
  const [_, attrs] = splitProps(props, ["class"]);

  const classes = () => twMerge(clsx(baseControlClass, props.class));

  return (
    <div {...attrs} class={classes()}>
      {props.children}
    </div>
  );
}

function FieldError(props: FieldErrorProps) {
  const [_, attrs] = splitProps(props, ["class"]);

  const classes = () => twMerge(clsx(baseErrorClass, props.class));

  return (
    <ArkField.ErrorText {...attrs} class={classes()}>
      {props.children}
    </ArkField.ErrorText>
  );
}

function FieldInput(props: FieldInputProps) {
  const [_, attrs] = splitProps(props, ["copyable", "type"]);
  const [isHide, setIsHide] = createSignal(true);

  let inputElement: HTMLInputElement | undefined = undefined;

  return (
    <FieldControl>
      <Input
        {...attrs}
        ref={inputElement}
        type={isHide() ? props.type : "text"}
        containerClass={twMerge(clsx("grow", props.containerClass))}
      />
      <Show when={props.copyable}>
        <Button
          title="Скопировать"
          onclick={() => copyToClipboard(inputElement!.value)}
          iconStart={<Clipboard />}
          size="md"
        />
      </Show>
      <Show when={props.type === "password"}>
        <Button
          title="Показать"
          onmousedown={() => setIsHide(false)}
          onmouseup={() => setIsHide(true)}
          onmouseleave={() => setIsHide(true)}
          iconStart={<Eye />}
          size="md"
        />
      </Show>
    </FieldControl>
  );
}

function FieldSelect(props: FieldSelectProps) {
  const [_, attrs] = splitProps(props, ["class", "containerClass"]);

  return (
    <FieldControl>
      <Select
        {...attrs}
        class={twMerge(clsx("w-full", props.class))}
        containerClass={twMerge(clsx("w-full", props.containerClass))}
      />
    </FieldControl>
  );
}

Field.Label = FieldLabel;
Field.Control = FieldControl;
Field.Input = FieldInput;
Field.Select = FieldSelect;
Field.Error = FieldError;
