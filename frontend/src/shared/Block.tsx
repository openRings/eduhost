import { HTMLArkProps } from "@ark-ui/solid";
import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

const baseClass =
  "p-2xl group gap-2xl hover:ring-primary-300 flex cursor-pointer flex-col justify-between rounded-md bg-gradient-to-t from-neutral-100 to-white ring-1 ring-neutral-300 transition ring-inset hover:from-neutral-200 hover:to-neutral-100";

export type BlockProps = HTMLArkProps<"div"> & {
  label?: JSX.Element;
  icon?: JSX.Element;
};

export function Block(props: BlockProps) {
  const [_, attrs] = splitProps(props, ["label", "icon", "class"]);

  const classes = () => twMerge(clsx(baseClass, props.class));

  return (
    <div {...attrs} class={classes()}>
      <div class="group-hover:text-primary-300 gap-4xl flex w-full items-start justify-between text-neutral-400 transition-colors">
        <div class="gap-xs group-hover:text-primary-300 flex min-w-0 flex-col text-neutral-700">
          {props.label}
        </div>
        {props.icon}
      </div>
      {props.children}
    </div>
  );
}
