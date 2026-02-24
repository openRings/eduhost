import { HTMLArkProps } from "@ark-ui/solid";
import { JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

const baseContainerClass = "group flex flex-col gap-xs items-start";

const basePrimaryLabelContainerClass = "flex items-center gap-xs";

const baseSubLabelClass = "leading-none text-neutral-500";

const baseClass = "leading-none";

export type BaseLabelProps = {
  icon?: JSX.Element;
  subLabel?: JSX.Element;
  subLabelClass?: string;
};

export type LabelProps = HTMLArkProps<"div"> & BaseLabelProps;

export function Label(props: LabelProps) {
  const [_, attrs] = splitProps(props, [
    "class",
    "icon",
    "subLabel",
    "subLabelClass",
  ]);

  const containerClasses = () => twMerge(clsx(baseContainerClass));

  const primaryLabelContainerClasses = () =>
    twMerge(clsx(basePrimaryLabelContainerClass));

  const subLabelClasses = () =>
    twMerge(clsx(baseSubLabelClass, props.subLabelClass));

  const classes = () => twMerge(clsx(baseClass, props.class));

  return (
    <div {...attrs} class={containerClasses()}>
      <div class={primaryLabelContainerClasses()}>
        {props.icon}
        <span class={classes()}>{props.children}</span>
      </div>
      <span class={subLabelClasses()}>{props.subLabel}</span>
    </div>
  );
}
