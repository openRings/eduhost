import { For } from "solid-js";
import { notifications } from "../utils/notifications";
import { Notification } from "../components/Notification";

export type NotificationsProps = {};

export function Notifications(_props: NotificationsProps) {
  return (
    <div class="gap-2xl fixed right-0 bottom-0 z-[9999]! flex flex-col items-end p-12">
      <For each={notifications()}>
        {(notification) => <Notification {...notification} />}
      </For>
    </div>
  );
}
