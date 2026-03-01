import z from "zod";
import { createForm } from "../shared/Form";
import { Section } from "../shared/Section";
import { Contact, KeyRound, LogIn } from "lucide-solid";

const FormData = z.object({
  username: z
    .string()
    .min(4)
    .max(12)
    .lowercase()
    .regex(/^[^\d]/, "Не должен начинаться с цифры"),
  password: z.string().min(8).max(32),
});

export default function () {
  const { Form } = createForm(FormData);

  return (
    <Section label="Формы">
      <Form class="gap-3xl mx-auto flex w-96 flex-col">
        <Form.Field
          icon={<Contact />}
          label="Юзернейм"
          name="username"
          placeholder="Введите ваш юзернейм"
        />
        <Form.Field
          icon={<KeyRound />}
          type="password"
          name="password"
          label="Пароль"
          placeholder="Придумайте пароль"
        />
        <div class="gap-md flex">
          <Form.Clear />
          <Form.Submit class="grow" variant="primary" iconStart={<LogIn />}>
            Войти
          </Form.Submit>
        </div>
      </Form>
    </Section>
  );
}
