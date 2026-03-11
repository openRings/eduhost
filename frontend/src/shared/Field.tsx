import { Field as ArkField, HTMLArkProps } from "@ark-ui/solid";
import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Button, ButtonProps } from "./uikit/Button";
import { Input, InputProps } from "./uikit/Input";
import { Select, SelectProps } from "./uikit/Select";

export type FieldProps = HTMLArkProps<"div"> & {
  containerClass?: string;
  invalid?: boolean;
};

export type FieldLabelProps = HTMLArkProps<"label"> & {
  icon?: JSX.Element;
};

export type FieldControlProps = HTMLArkProps<"div">;

export type FieldErrorProps = HTMLArkProps<"span">;

export type FieldInputProps = InputProps;

export type FieldSelectProps = SelectProps;
export type FieldButtonProps = ButtonProps;

type FieldComponent = ((props: FieldProps) => JSX.Element) & {
  Label: (props: FieldLabelProps) => JSX.Element;
  Control: (props: FieldControlProps) => JSX.Element;
  Input: (props: FieldInputProps) => JSX.Element;
  Select: (props: FieldSelectProps) => JSX.Element;
  Button: (props: FieldButtonProps) => JSX.Element;
  Error: (props: FieldErrorProps) => JSX.Element;
};

const fieldRootClass =
  "flex w-full flex-col gap-md border-l border-neutral-300 pl-md items-stretch";

export const Field = ((props: FieldProps) => {
  const [_, attrs] = splitProps(props, ["containerClass", "class"]);

  const classes = () =>
    twMerge(clsx(fieldRootClass, props.containerClass, props.class));

  return (
    <ArkField.Root {...attrs} class={classes()}>
      {props.children}
    </ArkField.Root>
  );
}) as FieldComponent;

const fieldLabelClass = "gap-xs flex text-neutral-500";

function FieldLabel(props: FieldLabelProps) {
  const [_, attrs] = splitProps(props, ["icon", "class"]);

  const classes = () => twMerge(clsx(fieldLabelClass, props.class));

  return (
    <ArkField.Label {...attrs} class={classes()}>
      {props.icon}
      {props.children}
    </ArkField.Label>
  );
}

const fieldControlClass = "gap-xs flex w-full";

function FieldControl(props: FieldControlProps) {
  const [_, attrs] = splitProps(props, ["class"]);

  const classes = () => twMerge(clsx(fieldControlClass, props.class));

  return (
    <div {...attrs} class={classes()}>
      {props.children}
    </div>
  );
}

const fieldErrorClass = "text-error-300";

function FieldError(props: FieldErrorProps) {
  const [_, attrs] = splitProps(props, ["class"]);

  const classes = () => twMerge(clsx(fieldErrorClass, props.class));

  return (
    <ArkField.ErrorText {...attrs} class={classes()}>
      {props.children}
    </ArkField.ErrorText>
  );
}

function FieldButton(props: FieldButtonProps) {
  return <Button {...props} size={props.size ?? "md"} />;
}

function FieldInput(props: FieldInputProps) {
  return (
    <Input
      {...props}
      containerClass={twMerge(clsx("grow", props.containerClass))}
    />
  );
}

function FieldSelect(props: FieldSelectProps) {
  const [_, attrs] = splitProps(props, ["class", "containerClass"]);

  return (
    <FieldControl>
      <Select
        autosize={false}
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
Field.Button = FieldButton;
Field.Error = FieldError;
