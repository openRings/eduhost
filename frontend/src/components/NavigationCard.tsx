import { A } from "@solidjs/router";
import { ChevronRight } from "lucide-solid";
import { JSX } from "solid-js";
import { Block } from "../shared/Block";

export type NavigationCardProps = {
  href: string;
  title: string;
  description: string;
  icon: JSX.Element;
};

export function NavigationCard(props: NavigationCardProps) {
  return (
    <A href={props.href}>
      <Block
        title={props.title}
        class="h-40"
        label={<span class="text-2xl text-neutral-700">{props.icon}</span>}
      >
        <div class="flex items-end justify-between">
          <div class="gap-md flex flex-col">
            <span class="group-hover:text-primary-300 text-lg leading-none">
              {props.title}
            </span>
            <span class="text-neutral-500">{props.description}</span>
          </div>
          <ChevronRight class="group-hover:text-primary-300 text-xl" />
        </div>
      </Block>
    </A>
  );
}
