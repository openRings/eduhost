import { HTMLArkProps } from "@ark-ui/solid";
import { A, AnchorProps } from "@solidjs/router";
import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { twMerge } from "tailwind-merge";

type BaseBlockProps = {
  variant?: "default" | "lined";
  label?: JSX.Element;
  icon?: JSX.Element;
};

export type BlockProps =
  | (HTMLArkProps<"div"> & BaseBlockProps)
  | (AnchorProps & BaseBlockProps & { href: string });

const baseClass =
  "p-2xl group gap-2xl flex flex-col justify-between ring-inset";

const variantClass = {
  default:
    "rounded-md bg-gradient-to-t from-neutral-100 to-white ring-1 ring-neutral-300",
  lined:
    "items-center justify-center rounded-md [background-image:repeating-linear-gradient(-45deg,transparent,transparent_9px,currentColor_9px,currentColor_12px)] text-neutral-300/40 ring-1 ring-neutral-400 duration-150",
} as const;

const interactiveVariantClass = {
  default:
    "cursor-pointer transition hover:ring-primary-300 hover:from-neutral-200 hover:to-neutral-100",
  lined:
    "cursor-pointer transition hover:ring-primary-300 hover:text-primary-100/20",
} as const;

const iconClass = {
  default: "gap-4xl flex w-full items-start justify-between text-neutral-400",
  lined: "gap-4xl flex w-full items-start justify-between text-neutral-500",
} as const;

const interactiveIconClass = {
  default: "transition-colors group-hover:text-primary-300",
  lined: "transition-colors group-hover:text-primary-300",
} as const;

const labelClass = {
  default: "gap-xs flex min-w-0 flex-col text-neutral-700",
  lined: "gap-xs flex min-w-0 flex-col text-neutral-500",
} as const;

const interactiveLabelClass = {
  default: "group-hover:text-primary-300",
  lined: "group-hover:text-primary-300",
} as const;

export function Block(props: BlockProps) {
  const [_, attrs] = splitProps(props, [
    "href",
    "variant",
    "label",
    "icon",
    "class",
  ]);
  const variant = () => props.variant ?? "default";
  const isInteractive = () => "href" in props;

  const classes = () =>
    twMerge(
      clsx(
        baseClass,
        variantClass[variant()],
        isInteractive() && interactiveVariantClass[variant()],
        props.class,
      ),
    );

  const children = () => (
    <>
      <div
        class={twMerge(
          clsx(
            iconClass[variant()],
            isInteractive() && interactiveIconClass[variant()],
          ),
        )}
      >
        <div
          class={twMerge(
            clsx(
              labelClass[variant()],
              isInteractive() && interactiveLabelClass[variant()],
            ),
          )}
        >
          {props.label}
        </div>
        {props.icon}
      </div>
      {props.children}
    </>
  );

  const component = () =>
    "href" in props ? (
      <A {...(attrs as AnchorProps)} href={props.href} class={classes()}>
        {children()}
      </A>
    ) : (
      <div {...(attrs as HTMLArkProps<"div">)} class={classes()}>
        {children()}
      </div>
    );

  return <Dynamic component={component} />;
}
