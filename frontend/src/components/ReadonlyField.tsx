import { HTMLArkProps } from "@ark-ui/solid";
import { Clipboard } from "lucide-solid";
import { JSX, splitProps } from "solid-js";
import { copyToClipboard } from "../utils/clipboard";
import { Field } from "../shared/Field";

export type ReadonlyFieldProps = Omit<HTMLArkProps<"div">, "value"> & {
  label: string;
  value: string;
  icon?: JSX.Element;
  copyable?: boolean;
};

export function ReadonlyField(props: ReadonlyFieldProps) {
  const [_, attrs] = splitProps(props, [
    "label",
    "value",
    "icon",
    "copyable",
    "class",
  ]);

  return (
    <Field {...attrs} class={props.class}>
      <Field.Label icon={props.icon}>{props.label}</Field.Label>
      <Field.Control>
        <Field.Input value={props.value} readonly />
        {props.copyable && (
          <Field.Button
            title="Скопировать"
            iconStart={<Clipboard />}
            onclick={() => copyToClipboard(props.value)}
          />
        )}
      </Field.Control>
      <Field.Error />
    </Field>
  );
}
