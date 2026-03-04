import { HTMLArkProps } from "@ark-ui/solid";
import { clsx } from "clsx";
import { splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

const baseClass = "inline-flex items-baseline";
const unitBaseClass = "text-[10px] text-neutral-500";

const units = ["Б", "КБ", "МБ", "ГБ", "ТБ"];

const formatBytes = (bytes: number) => {
  const sign = bytes < 0 ? -1 : 1;
  let value = Math.abs(bytes);
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  if (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const signedValue = value * sign;

  if (signedValue >= 100 || signedValue <= -100) {
    return { value: signedValue.toFixed(0), unit: units[unitIndex] };
  }

  if (signedValue >= 10 || signedValue <= -10) {
    return { value: signedValue.toFixed(1), unit: units[unitIndex] };
  }

  return { value: signedValue.toFixed(2), unit: units[unitIndex] };
};

export type VolumeProps = Omit<HTMLArkProps<"span">, "children"> & {
  bytes: number;
  unitClass?: string;
  valueClass?: string;
};

export function Volume(props: VolumeProps) {
  const [_, attrs] = splitProps(props, ["bytes", "class", "unitClass", "valueClass"]);

  const classes = () => twMerge(clsx(baseClass, props.class));
  const unitClasses = () => twMerge(clsx(unitBaseClass, props.unitClass));

  const formatted = () => formatBytes(props.bytes);

  return (
    <span {...attrs} class={classes()}>
      <span class={props.valueClass}>{formatted().value}</span>
      <span class={unitClasses()}>{formatted().unit}</span>
    </span>
  );
}
