import { ark, type HTMLArkProps } from "@ark-ui/solid";
import { clsx } from "clsx";
import { type JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

type Variant = "default" | "transparent" | "accent" | "primary" | "danger";
type Size = "sm" | "md";

type ArkButtonProps = HTMLArkProps<"button">;

export type ButtonProps = ArkButtonProps & {
  variant?: Variant;
  size?: Size;
  iconStart?: JSX.Element;
  iconEnd?: JSX.Element;
  class?: string;
};

const baseClass =
  "inline-flex items-center gap-xs rounded-sm transition-colors duration-150";

const variantClass: Record<Variant, string> = {
  default:
    "ring-1 ring-inset ring-neutral-300 bg-gradient-to-t from-neutral-100 to-white hover:from-neutral-200 hover:to-neutral-100 hover:ring-neutral-400 active:from-neutral-300 active:to-neutral-200 active:ring-neutral-500 disabled:from-neutral-100 disabled:to-white disabled:ring-neutral-300 disabled:text-neutral-500",
  transparent:
    "hover:bg-neutral-200 active:bg-neutral-300 disabled:bg-transparent disabled:text-neutral-500",
  accent:
    "ring-1 ring-inset ring-neutral-600 bg-neutral-700 text-white hover:bg-neutral-800 hover:ring-neutral-700 active:bg-neutral-900 active:ring-neutral-800 disabled:bg-neutral-700 disabled:ring-neutral-600 disabled:text-white/60",
  primary:
    "ring-1 ring-inset ring-primary-200 bg-primary-300 text-white hover:bg-primary-400 hover:ring-primary-300 active:bg-primary-500 active:ring-primary-400 disabled:bg-primary-300 disabled:ring-primary-200 disabled:text-white/60",
  danger:
    "ring-1 ring-inset ring-error-200 bg-error-300 text-white hover:bg-error-400 hover:ring-error-300 active:bg-error-500 active:ring-error-400 disabled:ring-error-200 disabled:bg-error-300 disabled:text-white/60",
};

const sizeClass: Record<Size, string> = {
  sm: "px-md py-xs",
  md: "px-lg py-md",
};

export function Button(props: ButtonProps) {
  const [_, attrs] = splitProps(props, [
    "variant",
    "size",
    "iconStart",
    "iconEnd",
    "class",
  ]);

  const classes = () =>
    twMerge(
      clsx(
        baseClass,
        variantClass[props.variant ?? "default"],
        sizeClass[props.size ?? "md"],
        props.class,
      ),
    );

  return (
    <ark.button {...attrs} class={classes()}>
      {props.iconStart}
      {props.children}
      {props.iconEnd}
    </ark.button>
  );
}
