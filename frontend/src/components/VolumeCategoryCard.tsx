import { HTMLArkProps } from "@ark-ui/solid";
import { clsx } from "clsx";
import { ExternalLink } from "lucide-solid";
import { JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Volume } from "../shared/Volume";

export type VolumeCategoryCardProps = HTMLArkProps<"div"> & {
  label: JSX.Element;
  labelIcon?: JSX.Element;
  bytes: number;
  percentLabel?: string;
  badgeClass?: string;
};

const containerClass =
  "flex h-20 flex-1 flex-col justify-between rounded-md bg-linear-to-t from-neutral-100 to-white p-2 ring-1 ring-neutral-300 ring-inset";
const baseBadgeClass =
  "gap-xs flex rounded-sm bg-neutral-200 px-1.5 py-1 ring-1 ring-neutral-300 ring-inset";
const actionClass = "text-neutral-400";

export function VolumeCategoryCard(props: VolumeCategoryCardProps) {
  const [_, attrs] = splitProps(props, [
    "label",
    "labelIcon",
    "bytes",
    "percentLabel",
    "badgeClass",
    "class",
  ]);

  const classes = () => twMerge(clsx(containerClass, props.class));
  const badgeClasses = () => twMerge(clsx(baseBadgeClass, props.badgeClass));

  return (
    <div {...attrs} class={classes()}>
      <div class="flex justify-between">
        <div class={badgeClasses()}>
          {props.labelIcon}
          <span>{props.label}</span>
        </div>
        <ExternalLink class={actionClass} />
      </div>
      <div class="flex items-end justify-between">
        <Volume bytes={props.bytes} class="text-xl" unitClass="text-sm" />
        <span class="text-neutral-500">{props.percentLabel ?? "100%"}</span>
      </div>
    </div>
  );
}
