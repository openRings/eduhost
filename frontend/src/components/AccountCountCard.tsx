import { JSX, Suspense } from "solid-js";
import { Block } from "../shared/Block";
import { Skeleton } from "../shared/Skeleton";

export type AccountCountCardProps = {
  label: string;
  count: number | undefined;
  title?: string;
  icon?: JSX.Element;
  class?: string;
};

export function AccountCountCard(props: AccountCountCardProps) {
  return (
    <Block
      title={props.title}
      class={props.class}
      icon={props.icon}
      label={
        <Suspense fallback={<Skeleton class="h-7 w-10" />}>
          <span class="text-2xl text-neutral-700">{props.count ?? 0}</span>
        </Suspense>
      }
    >
      <span class="group-hover:text-primary-300 text-neutral-500">
        {props.label}
      </span>
    </Block>
  );
}
