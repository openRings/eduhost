import { HTMLArkProps } from "@ark-ui/solid";
import { JSX, splitProps } from "solid-js";

export type BlockProps = Omit<HTMLArkProps<"div">, "title"> & {
  title?: JSX.Element;
  icon?: JSX.Element;
};

export function Block(props: BlockProps) {
  const [_, attrs] = splitProps(props, ["title", "icon"]);

  const blockTitle = () =>
    String(Array.isArray(props.title) ? props.title[0] : props.title);

  return (
    <div
      {...attrs}
      title={blockTitle()}
      class="p-2xl group gap-2xl hover:ring-primary-300 flex cursor-pointer flex-col justify-between rounded-md bg-gradient-to-t from-neutral-100 to-white ring-1 ring-neutral-300 transition ring-inset hover:from-neutral-200 hover:to-neutral-100"
    >
      <div class="group-hover:text-primary-300 flex w-full items-start justify-between text-neutral-400 transition-colors">
        <div class="gap-xs group-hover:text-primary-300 flex flex-col text-neutral-700">
          {props.title}
        </div>
        {props.icon}
      </div>
      {props.children}
    </div>
  );
}
