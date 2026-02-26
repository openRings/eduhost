import { createSignal, createUniqueId } from "solid-js";

export { notifications };

export type NotificationLevel = "info" | "success" | "warning" | "error";

export type Notification = {
  id: string;
  level: NotificationLevel;
  message: string;
};

const NOTIFICATION_TIMEOUT = 3000;

const [notifications, setNotifications] = createSignal<Notification[]>([]);

export const info = (m: string) => notification("info", m);
export const success = (m: string) => notification("success", m);
export const warning = (m: string) => notification("warning", m);
export const error = (m: string) => notification("error", m);

function notification(level: NotificationLevel, message: string) {
  const id = createUniqueId();

  setNotifications((prev) => [{ id, level, message }, ...prev]);

  setTimeout(
    () => setNotifications((prev) => prev.filter((n) => n.id != id)),
    NOTIFICATION_TIMEOUT,
  );
}
