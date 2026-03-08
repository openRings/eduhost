import { HTMLArkProps } from "@ark-ui/solid";
import { clsx } from "clsx";
import { X } from "lucide-solid";
import {
  createEffect,
  createSignal,
  createUniqueId,
  onMount,
  onCleanup,
  Show,
  splitProps,
} from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";
import { twMerge } from "tailwind-merge";

export type ModalProps = Omit<HTMLArkProps<"div">, "title"> & {
  title?: string;
  isOpen?: boolean;
  zLevel?: number;
  onclose?: () => void;
};

const baseOverlayClass =
  "fixed inset-0 flex items-center justify-center bg-black/25 p-md backdrop-blur-xs";
const baseContentClass =
  "p-2xl gap-2xl flex w-full max-w-[640px] flex-col rounded-md bg-gradient-to-t from-neutral-100 to-white ring-1 ring-neutral-400 ring-inset";
const titleClass = "text-neutral-700";
const titleActionsClass = "gap-sm flex items-center";
const actionButtonClass =
  "cursor-pointer text-neutral-500 hover:text-neutral-700 transition-colors";

const openedStack: string[] = [];

function lockScroll() {
  if (document.body.classList.contains("overflow-hidden!")) return;
  const scrollbarWidth =
    window.innerWidth - document.documentElement.offsetWidth;
  document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
  document.body.classList.add("overflow-hidden!");
}

function unlockScroll() {
  if (openedStack.length) return;
  document.body.classList.remove("overflow-hidden!");
  document.documentElement.style.paddingRight = "";
}

export default function Modal(props: ModalProps) {
  const [_, attrs] = splitProps(props, [
    "title",
    "isOpen",
    "zLevel",
    "onclose",
    "class",
  ]);

  const modalId = createUniqueId();
  const [zLevel, setZLevel] = createSignal(props.zLevel ?? 40);
  const isOpen = () => !!props.isOpen;

  const close = () => props.onclose?.();

  const removeFromStack = () => {
    const index = openedStack.indexOf(modalId);
    if (index >= 0) openedStack.splice(index, 1);
  };

  createEffect(() => {
    if (!isOpen()) {
      removeFromStack();
      unlockScroll();
      return;
    }

    if (!openedStack.includes(modalId)) openedStack.push(modalId);

    setZLevel(props.zLevel ?? 40 + openedStack.length);
    lockScroll();
  });

  const handleEsc = (event: KeyboardEvent) => {
    if (event.code !== "Escape" || !isOpen()) return;
    if (openedStack[openedStack.length - 1] !== modalId) return;
    close();
  };

  onMount(() => {
    window.addEventListener("keyup", handleEsc);
    onCleanup(() => window.removeEventListener("keyup", handleEsc));
  });

  onCleanup(() => {
    removeFromStack();
    unlockScroll();
  });

  const contentClasses = () => twMerge(clsx(baseContentClass, props.class));

  return (
    <Portal mount={document.body}>
      <Presence>
        <Show when={isOpen()}>
          <Motion.section
            class={baseOverlayClass}
            style={{ "z-index": zLevel() }}
            animate={{ opacity: [0, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onclick={close}
          >
            <Motion.div
              {...attrs}
              class={contentClasses()}
              animate={{ scale: [1.02, 1], y: [-8, 0] }}
              exit={{ scale: 1.02, y: -8 }}
              transition={{ duration: 0.2 }}
              onclick={(event) => event.stopPropagation()}
            >
              <Show when={props.title}>
                <div class="flex items-center justify-between">
                  <h1 class={titleClass}>{props.title}</h1>
                  <div class={titleActionsClass}>
                    <button
                      class={actionButtonClass}
                      type="button"
                      title="Закрыть"
                      onclick={close}
                    >
                      <X />
                    </button>
                  </div>
                </div>
              </Show>

              {props.children}
            </Motion.div>
          </Motion.section>
        </Show>
      </Presence>
    </Portal>
  );
}
