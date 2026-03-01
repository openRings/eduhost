import { ark, HTMLArkProps } from "@ark-ui/solid";
import { A, AnchorProps } from "@solidjs/router";
import { clsx } from "clsx";
import { LoaderCircle } from "lucide-solid";
import { JSX, splitProps, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { twMerge } from "tailwind-merge";

const baseClass =
  "inline-flex items-center gap-xs rounded-sm transition-colors duration-150 justify-center cursor-pointer disabled:cursor-not-allowed group";

const variantClass = {
  default:
    "ring-1 ring-inset ring-neutral-300 bg-gradient-to-t from-neutral-100 to-white hover:from-neutral-200 hover:to-neutral-100 hover:ring-neutral-400 active:from-neutral-300 active:to-neutral-200 active:ring-neutral-500 disabled:from-neutral-100 disabled:to-white disabled:ring-neutral-300 disabled:text-neutral-500",
  lined:
    "items-center justify-center rounded-md [background-image:repeating-linear-gradient(-45deg,transparent,transparent_9px,currentColor_9px,currentColor_12px)] text-neutral-300/40 ring-1 ring-neutral-400 ring-inset hover:ring-primary-300 hover:text-primary-100/20 transition duration-150",
  transparent:
    "hover:bg-neutral-200 active:bg-neutral-300 disabled:bg-transparent disabled:text-neutral-500",
  accent:
    "ring-1 ring-inset ring-neutral-600 bg-neutral-700 text-white hover:bg-neutral-800 hover:ring-neutral-700 active:bg-neutral-900 active:ring-neutral-800 disabled:bg-neutral-700 disabled:ring-neutral-600 disabled:text-white/60",
  primary:
    "ring-1 ring-inset ring-primary-200 bg-primary-300 text-white hover:bg-primary-400 hover:ring-primary-300 active:bg-primary-500 active:ring-primary-400 disabled:bg-primary-300 disabled:ring-primary-200 disabled:text-white/60",
  danger:
    "ring-1 ring-inset ring-error-200 bg-error-300 text-white hover:bg-error-400 hover:ring-error-300 active:bg-error-500 active:ring-error-400 disabled:ring-error-200 disabled:bg-error-300 disabled:text-white/60",
};

const sizeClass = {
  "icon-sm": "size-6",
  "icon-md": "size-8",
  sm: "px-md h-6",
  md: "px-lg h-8",
};

export type BaseButtonProps = {
  variant?: keyof typeof variantClass;
  size?: keyof typeof sizeClass;
  isPending?: boolean;
  pendingText?: string;
  iconStart?: JSX.Element;
  iconEnd?: JSX.Element;
};

export type ButtonProps =
  | (HTMLArkProps<"button"> & BaseButtonProps)
  | (AnchorProps & BaseButtonProps & { href: string });

export function Button(props: ButtonProps) {
  const [_, attrs] = splitProps(props, [
    "variant",
    "size",
    "isPending",
    "pendingText",
    "onclick",
    "iconStart",
    "iconEnd",
    "class",
  ]);

  const classes = () =>
    twMerge(
      clsx(
        baseClass,
        variantClass[props.variant ?? "default"],
        sizeClass[props.size ?? "md"],
        props.isPending && "cursor-progress",
        props.class,
      ),
    );

  const children = () => (
    <Show
      when={!props.isPending}
      fallback={
        <>
          <LoaderCircle class="animate-spin" />{" "}
          <Show when={!props.size?.startsWith("icon")}>
            {props.pendingText ?? "Подождите.."}
          </Show>
        </>
      }
    >
      <Show
        when={props.variant == "lined"}
        fallback={
          <>
            {props.iconStart}
            {props.children}
            {props.iconEnd}
          </>
        }
      >
        <div class="gap-xs group-hover:text-primary-300 flex text-neutral-500 transition-colors">
          {props.iconStart}
          {props.children}
          {props.iconEnd}
        </div>
      </Show>
    </Show>
  );

  const component = () =>
    "href" in props ? (
      <A {...(attrs as AnchorProps)} class={classes()}>
        {children()}
      </A>
    ) : (
      <ark.button
        {...(attrs as HTMLArkProps<"button">)}
        onclick={(e) => {
          if (props.isPending) return;
          props.onclick && (props.onclick as CallableFunction)(e);
        }}
        type={props.type ?? "button"}
        class={classes()}
      >
        {children()}
      </ark.button>
    );

  return <Dynamic component={component} />;
}
