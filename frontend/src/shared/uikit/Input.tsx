import { ark, HTMLArkProps } from "@ark-ui/solid";
import { clsx } from "clsx";
import { createUniqueId, JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export type InputProps = HTMLArkProps<"input"> & {
  size?: "sm" | "md";
  icon?: JSX.Element;
  containerClass?: string;
};

const baseClass =
  "transition-colors duration-150 grow outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:placeholder:text-neutral-400";

const baseContainerClass =
  "flex rounded-sm transition-colors duration-150 items-center cursor-text ring-1 ring-inset ring-neutral-300 text-neutral-700 [&:has(input:placeholder-shown)]:text-neutral-500 bg-gradient-to-t from-neutral-100 to-white [&:has(input:focus)]:ring-neutral-400 [&:has(input:focus)]:from-neutral-200 [&:has(input:focus)]:to-neutral-100 hover:ring-neutral-400 relative [&:has(input:disabled)]:cursor-not-allowed [&:has(input:disabled)]:ring-neutral-300 [&:has(input:disabled)]:text-neutral-400!";

const sizeContainerClass = {
  sm: "px-sm h-6 gap-xs",
  md: "px-md h-8 gap-sm",
} as const;

export function Input(props: InputProps) {
  const [_, attrs] = splitProps(props, [
    "size",
    "icon",
    "class",
    "containerClass",
  ]);

  const inputId = createUniqueId();

  const classes = () => twMerge(clsx(baseClass, props.class));

  const containerClasses = () =>
    twMerge(
      clsx(
        baseContainerClass,
        sizeContainerClass[props.size ?? "md"],
        props.containerClass,
      ),
    );

  return (
    <label for={props.id ?? inputId} class={containerClasses()}>
      {props.icon}
      <ark.input id={inputId} {...attrs} class={classes()}>
        {props.children}
      </ark.input>
    </label>
  );
}
