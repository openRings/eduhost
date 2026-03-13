import { HTMLArkProps } from "@ark-ui/solid";
import { Clipboard } from "lucide-solid";
import { JSX, Show, splitProps } from "solid-js";
import { copyToClipboard } from "../utils/clipboard";
import { Field } from "../shared/Field";
import { Skeleton } from "../shared/Skeleton";

export type ReadonlyFieldProps = Omit<HTMLArkProps<"div">, "value"> & {
  label: string;
  value?: string;
  icon?: JSX.Element;
  copyable?: boolean;
  isLoading?: boolean;
};

export function ReadonlyField(props: ReadonlyFieldProps) {
  const [_, attrs] = splitProps(props, [
    "label",
    "value",
    "icon",
    "copyable",
    "isLoading",
    "class",
  ]);

  return (
    <Field {...attrs} class={props.class}>
      <Field.Label icon={props.icon}>{props.label}</Field.Label>
      <Field.Control>
        <Show
          when={!props.isLoading}
          fallback={<Skeleton class="h-8 w-full" radius="sm" />}
        >
          <Field.Input value={props.value ?? ""} readonly />
        </Show>
        {props.copyable && !!props.value && !props.isLoading && (
          <Field.Button
            title="Скопировать"
            iconStart={<Clipboard />}
            onclick={() => copyToClipboard(props.value!)}
          />
        )}
      </Field.Control>
      <Field.Error />
    </Field>
  );
}
