import { twMerge } from "tailwind-merge";
import {
  NotificationLevel,
  Notification as NotificationType,
} from "../utils/notifications";
import clsx from "clsx";
import { CircleCheck, Info, OctagonAlert, TriangleAlert } from "lucide-solid";
import { Motion, Presence } from "solid-motionone";

const baseContainerClass =
  "ring-1 ring-inset px-2xl py-xl flex items-center gap-md rounded-md shadow-md w-fit max-w-[480px]";

const levelContainerClass: Record<NotificationLevel, string> = {
  info: "bg-linear-to-t from-neutral-100 to-white ring-neutral-300 text-neutral-700",
  success: "bg-success-300 ring-success-400 text-white",
  warning: "bg-warning-300 ring-warning-400 text-white",
  error: "bg-error-300 ring-error-400 text-white",
};

export type NotificationProps = NotificationType;

export function Notification(props: NotificationProps) {
  const containerClasses = () =>
    twMerge(clsx(baseContainerClass, levelContainerClass[props.level]));

  return (
    <Presence>
      <Motion.div
        animate={{ opacity: [0, 1], x: [32, 0] }}
        exit={{ scale: 1.1, opacity: 0 }}
        class={containerClasses()}
      >
        <div class="text-lg">{iconComponent(props.level)}</div>
        <p class="leading-[150%]">{props.message}</p>
      </Motion.div>
    </Presence>
  );
}

const iconComponent = (level: NotificationLevel) => {
  return {
    info: <Info />,
    success: <CircleCheck />,
    warning: <TriangleAlert />,
    error: <OctagonAlert />,
  }[level];
};
