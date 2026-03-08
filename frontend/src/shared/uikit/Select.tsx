import {
  Select as ArkSelect,
  createListCollection,
  SelectRootProps,
} from "@ark-ui/solid";
import { clsx } from "clsx";
import { Check, ChevronsUpDown } from "lucide-solid";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Show,
  splitProps,
} from "solid-js";
import { Portal } from "solid-js/web";
import { twMerge } from "tailwind-merge";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

const baseRootClass = "relative flex flex-col gap-xs";

const baseControlClass =
  "flex rounded-sm transition-colors duration-150 items-center cursor-pointer ring-1 ring-inset ring-neutral-300 text-neutral-700 bg-gradient-to-t from-neutral-100 to-white hover:ring-neutral-400 relative data-[disabled]:cursor-not-allowed data-[disabled]:ring-neutral-300 data-[disabled]:text-neutral-400";

const baseTriggerClass =
  "flex w-full h-full cursor-pointer items-center justify-between gap-sm bg-transparent text-left outline-none leading-none disabled:cursor-not-allowed data-[placeholder-shown]:text-neutral-500 disabled:data-[placeholder-shown]:text-neutral-400";

const sizeControlClass = {
  sm: "h-6 gap-xs text-xs",
  md: "h-8 gap-sm text-sm",
};

const sizeTriggerClass = {
  sm: "px-sm",
  md: "px-md",
};

const baseContentClass =
  "w-full min-w-full rounded-md ring-1 ring-inset ring-neutral-300 bg-white shadow-sm";

const baseListClass = "w-full min-w-full max-h-60 overflow-auto p-xs";

const baseItemClass =
  "flex items-center justify-between rounded-sm cursor-pointer text-neutral-700 transition-colors data-[highlighted]:bg-neutral-200 data-[disabled]:cursor-not-allowed data-[disabled]:text-neutral-400 gap-md";

const sizeItemClass = {
  sm: "px-xxs h-6 text-xs",
  md: "px-xs h-8 text-sm",
};

export type SelectProps = Omit<
  SelectRootProps<SelectOption>,
  "collection" | "onselect" | "value" | "defaultValue"
> & {
  items: SelectOption[];
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onselect?: (value: string) => void;
  size?: keyof typeof sizeControlClass;
  autosize?: boolean;
  containerClass?: string;
  triggerClass?: string;
  contentClass?: string;
  listClass?: string;
  itemClass?: string;
};

export function Select(props: SelectProps) {
  const [_, rootProps] = splitProps(props, [
    "items",
    "label",
    "placeholder",
    "value",
    "defaultValue",
    "onselect",
    "size",
    "autosize",
    "class",
    "containerClass",
    "triggerClass",
    "contentClass",
    "listClass",
    "itemClass",
  ]);

  const collection = createMemo(() =>
    createListCollection({
      items: props.items,
      itemToValue: (item) => item.value,
      itemToString: (item) => item.label,
      isItemDisabled: (item) => !!item.disabled,
    }),
  );

  const [maxWidth, setMaxWidth] = createSignal(0);
  let measureRef: HTMLDivElement | undefined;

  const rootClasses = () => twMerge(clsx(baseRootClass, props.class));

  const controlClasses = () =>
    twMerge(
      clsx(
        baseControlClass,
        sizeControlClass[props.size ?? "md"],
        props.containerClass,
      ),
    );

  const triggerClasses = () =>
    twMerge(
      clsx(
        baseTriggerClass,
        sizeTriggerClass[props.size ?? "md"],
        props.triggerClass,
      ),
    );

  const contentClasses = () =>
    twMerge(clsx(baseContentClass, props.contentClass));

  const listClasses = () => twMerge(clsx(baseListClass, props.listClass));

  const itemClasses = () =>
    twMerge(
      clsx(baseItemClass, sizeItemClass[props.size ?? "md"], props.itemClass),
    );

  createEffect(() => {
    if (props.autosize === false) return;

    const el = measureRef;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll("[data-measure-item]"));
    const nextWidth = Math.max(
      0,
      ...nodes.map((node) => (node as HTMLElement).offsetWidth),
    );
    if (nextWidth) setMaxWidth(nextWidth);
  });

  const selectWidth = () => (maxWidth() ? `${maxWidth()}px` : "fit-content");
  const widthStyle = () =>
    props.autosize === false ? undefined : { width: selectWidth() };
  const positionerStyle = () =>
    props.autosize === false
      ? {
          width: "var(--reference-width)",
          "min-width": "var(--reference-width)",
        }
      : { width: selectWidth(), "min-width": selectWidth() };

  const selectedValue = () =>
    props.value === undefined ? undefined : props.value ? [props.value] : [];
  const defaultSelectedValue = () =>
    props.defaultValue ? [props.defaultValue] : undefined;

  return (
    <ArkSelect.Root
      {...rootProps}
      collection={collection()}
      value={selectedValue()}
      defaultValue={defaultSelectedValue()}
      class={rootClasses()}
      onValueChange={(e) => props.onselect?.(e.value[0])}
      positioning={{ placement: "bottom-start", gutter: 0 }}
    >
      <ArkSelect.Context>
        {(api) => {
          const selectedIndex = () => {
            const value = api().value[0];
            if (!value) return 0;
            const index = collection().items.findIndex(
              (item) => item.value === value,
            );
            return index < 0 ? 0 : index;
          };

          const itemHeight = () => ((props.size ?? "md") === "sm" ? 24 : 32);

          return (
            <>
              <div
                ref={measureRef}
                class="pointer-events-none absolute top-0 left-0 -z-10 opacity-0"
                aria-hidden="true"
              >
                <div data-measure-item class={controlClasses()}>
                  <div class={triggerClasses()}>
                    <span class="flex-1">
                      {props.placeholder ?? "Выберите"}
                    </span>
                    <span>
                      <ChevronsUpDown />
                    </span>
                  </div>
                </div>
                <div class={contentClasses()}>
                  <div class={listClasses()}>
                    <div data-measure-item class={itemClasses()}>
                      <span class="flex-1">
                        {props.placeholder ?? "Выберите"}
                      </span>
                      <span class="text-neutral-700">
                        <Check />
                      </span>
                    </div>
                    <For each={collection().items}>
                      {(item) => (
                        <div data-measure-item class={itemClasses()}>
                          <span class="w-max flex-1">{item.label}</span>
                          <span class="ml-2 text-neutral-700">
                            <Check />
                          </span>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </div>
              <Show when={props.label}>
                <ArkSelect.Label class="text-xs text-neutral-600">
                  {props.label}
                </ArkSelect.Label>
              </Show>
              <ArkSelect.Control class={controlClasses()} style={widthStyle()}>
                <ArkSelect.Trigger class={triggerClasses()}>
                  <ArkSelect.ValueText
                    placeholder={props.placeholder ?? "Выберите"}
                  />
                  <ArkSelect.Indicator
                    class={
                      props.disabled ? "text-neutral-400" : "text-neutral-500"
                    }
                  >
                    <ChevronsUpDown />
                  </ArkSelect.Indicator>
                </ArkSelect.Trigger>
              </ArkSelect.Control>
              <Portal>
                <ArkSelect.Positioner
                  class="z-[9999]!"
                  style={positionerStyle()}
                >
                  <ArkSelect.Content
                    class={contentClasses()}
                    style={{
                      "--select-item-height": `${itemHeight()}px`,
                      "--select-selected-index": String(selectedIndex()),
                      transform:
                        "translateY(calc(-4px + var(--select-item-height) * (var(--select-selected-index) + 1) * -1))",
                    }}
                  >
                    <ArkSelect.List class={listClasses()}>
                      <For each={collection().items}>
                        {(item) => (
                          <ArkSelect.Item item={item} class={itemClasses()}>
                            <ArkSelect.ItemText class="flex-1">
                              {item.label}
                            </ArkSelect.ItemText>
                            <ArkSelect.ItemIndicator class="text-neutral-700">
                              <Check />
                            </ArkSelect.ItemIndicator>
                          </ArkSelect.Item>
                        )}
                      </For>
                    </ArkSelect.List>
                  </ArkSelect.Content>
                </ArkSelect.Positioner>
              </Portal>
              <ArkSelect.HiddenSelect />
            </>
          );
        }}
      </ArkSelect.Context>
    </ArkSelect.Root>
  );
}
