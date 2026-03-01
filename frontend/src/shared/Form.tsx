import {
  Accessor,
  createContext,
  createSignal,
  JSX,
  splitProps,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { FieldProps, Field as UIKitField } from "./Field";
import { z, ZodObject } from "zod";
import { Button, ButtonProps } from "./uikit/Button";
import { BrushCleaning } from "lucide-solid";
import { HTMLArkProps } from "@ark-ui/solid";

export function createForm<S extends ZodObject<any>>(schema: S) {
  type FormData = z.infer<S>;

  const FormContext = createContext<{
    values: Partial<FormData>;
    errors: Partial<Record<keyof FormData, string>>;
    isPending: Accessor<boolean>;
    clear: () => void;
    setFieldValue: <K extends keyof FormData>(
      name: K,
      value: FormData[K],
    ) => void;
  }>();

  function useFormContext() {
    const ctx = useContext(FormContext);
    if (!ctx) throw new Error("Form.Field must be inside Form");
    return ctx;
  }

  function Form(
    props: Omit<HTMLArkProps<"form">, "onsubmit"> & {
      onsubmit?: (data: FormData) => Promise<void>;
      children?: JSX.Element;
    },
  ) {
    const [_, attrs] = splitProps(props, ["onsubmit"]);

    const [isPending, setIsPending] = createSignal(false);

    const [values, setValues] = createStore<Partial<FormData>>({});
    const [errors, setErrors] = createStore<
      Partial<Record<keyof FormData, string>>
    >({});

    const setFieldValue = <K extends keyof FormData>(
      name: K,
      value: FormData[K],
    ) => {
      const result = schema.shape[name as any].safeParse(value);

      setValues(!!name ? (name as any) : null, value as any);

      if (!result.success && !!value) {
        setErrors(name as any, result.error.flatten().formErrors[0]);

        return;
      } else setErrors(name as any, undefined as any);
    };

    const clear = () => {
      for (const key in values) {
        setValues(key as any, null as any);
      }

      for (const key in errors) {
        setErrors(key as any, null as any);
      }
    };

    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      if (isPending()) return;

      const result = schema.safeParse(values);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        for (const key in fieldErrors) {
          setErrors(key as any, fieldErrors[key]?.[0] as any);
        }

        return;
      }

      setIsPending(true);

      try {
        props.onsubmit && (await props.onsubmit(result.data));
      } finally {
        setIsPending(false);
      }
    };

    return (
      <FormContext.Provider
        value={{ values, errors, isPending, clear, setFieldValue }}
      >
        <form {...attrs} onsubmit={handleSubmit}>
          {props.children}
        </form>
      </FormContext.Provider>
    );
  }

  function Field<K extends keyof FormData>(
    props: FieldProps & { name: K; label: string },
  ) {
    const [_, attrs] = splitProps(props, ["name", "value", "error", "oninput"]);

    const form = useFormContext();

    const value = () => form.values[props.name];
    const error = () => form.errors[props.name];

    const oninput = (e: Event & { target: any }) => {
      if (!error()) return;
      form.setFieldValue(props.name, e.target.value);
    };

    const onchange = (e: Event & { target: any }) => {
      form.setFieldValue(props.name, e.target.value);
    };

    return (
      <UIKitField
        {...attrs}
        value={value() as any}
        error={error()}
        oninput={oninput}
        onchange={onchange}
      />
    );
  }

  function ClearButton(props: ButtonProps) {
    const [_, attrs] = splitProps(props, ["onclick"]);

    const form = useFormContext();

    const isDisabled = () => {
      let isEmpty = true;
      for (const key in form.values) if (!!form.values[key]) isEmpty = false;
      return isEmpty;
    };

    return (
      <Button
        iconStart={<BrushCleaning />}
        title="Очистить форму"
        {...attrs}
        disabled={isDisabled()}
        onclick={form.clear}
      >
        {props.children ?? "Очистить"}
      </Button>
    );
  }

  function SubmitButton(props: ButtonProps) {
    const [_, attrs] = splitProps(props, []);

    const form = useFormContext();

    return (
      <Button {...attrs} isPending={form.isPending()} type="submit">
        {props.children}
      </Button>
    );
  }

  Form.Field = Field;
  Form.Clear = ClearButton;
  Form.Submit = SubmitButton;

  return Form;
}
