import { HTMLArkProps } from "@ark-ui/solid";
import { JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

const baseClass = "p-6xl gap-3xl flex flex-col rounded-md bg-neutral-100";

export type SectionProps = Omit<HTMLArkProps<"section">, "title"> & {
  title?: JSX.Element;
  description?: JSX.Element;
};

export function Section(props: SectionProps) {
  const [_, attrs] = splitProps(props, ["title", "description", "class"]);

  const classes = () => twMerge(clsx(baseClass, props.class));

  return (
    <section {...attrs} class={classes()}>
      {props.title}
      {props.children}
    </section>
  );
}
