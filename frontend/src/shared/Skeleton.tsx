import { ark, HTMLArkProps } from "@ark-ui/solid";
import { clsx } from "clsx";
import { splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

const baseClass = "animate-pulse bg-neutral-300";

const radiusClass = {
  sm: "rounded-sm",
  md: "rounded-md",
};

export type SkeletonProps = HTMLArkProps<"div"> & {
  radius?: keyof typeof radiusClass;
};

export function Skeleton(props: SkeletonProps) {
  const [_, attrs] = splitProps(props, ["radius", "class"]);

  const classes = () =>
    twMerge(clsx(baseClass, radiusClass[props.radius ?? "md"], props.class));

  return <ark.div {...attrs} class={classes()} aria-hidden />;
}
