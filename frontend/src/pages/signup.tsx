import z from "zod";
import { createForm } from "../shared/Form";
import { Section } from "../shared/Section";
import {
  ALargeSmall,
  BadgeCheck,
  Contact,
  KeyRound,
  UserPlus,
} from "lucide-solid";
import { Button } from "../shared/uikit/Button";
import { fetchApi } from "../utils/api";
import { success } from "../utils/notifications";
import { useNavigate } from "@solidjs/router";

const SigninForm = z
  .object({
    username: z.string().min(4).max(12).lowercase(),
    firstName: z.string().min(2).max(30),
    lastName: z.string().min(4).max(30),
    patronymic: z.string().min(4).max(30).optional(),
    password: z.string().min(8).max(32),
    passwordRepeat: z.string(),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    error: "Пароли отличаются",
    path: ["passwordRepeat"],
  });

export default function () {
  const { Form, values } = createForm(SigninForm);

  const navigate = useNavigate();

  const signup = async (data: z.infer<typeof SigninForm>) => {
    const { status } = await fetchApi("/auth/signup", {
      method: "POST",
      authRedirect: false,
      body: data,
    });

    if (status == 201) {
      success("Аккаунт успешно создан");
      navigate("/signin", {
        state: { username: values.username, password: values.password },
      });
    }
  };

  return (
    <Section class="h-screen items-center justify-center">
      <Form class="gap-3xl flex w-[360px] flex-col" onsubmit={signup}>
        <h1 class="text-lg text-neutral-400">Создание аккаунта</h1>
        <div class="gap-md flex flex-col">
          <Form.Field
            name="username"
            label="Юзернейм"
            icon={<Contact />}
            placeholder="Введите ваш юзернейм"
          />
          <Form.Field
            name="firstName"
            label="Имя"
            icon={<ALargeSmall />}
            placeholder="Введите ваше имя"
          />
          <Form.Field
            name="lastName"
            label="Фамилия"
            icon={<ALargeSmall />}
            placeholder="Введите вашу фамилию"
          />
          <Form.Field
            name="patronymic"
            label="Отчество"
            icon={<ALargeSmall />}
            placeholder="Введите ваше отчество"
          />
          <Form.Field
            name="password"
            label="Пароль"
            type="password"
            icon={<KeyRound />}
            placeholder="Придумайте сложный пароль"
          />
          <Form.Field
            name="passwordRepeat"
            label="Подтверждение пароля"
            type="password"
            icon={<BadgeCheck />}
            placeholder="Повторите пароль"
          />
        </div>
        <div class="gap-md flex">
          <Form.Clear></Form.Clear>
          <Form.Submit
            title="Создать аккаунт"
            pendingText="Создание.."
            class="grow"
            variant="primary"
            iconStart={<UserPlus />}
          >
            Создать
          </Form.Submit>
        </div>
        <Button variant="lined" class="h-[96px]" href="/signin">
          <div class="gap-md flex flex-col items-center">
            <span class="text-neutral-500">У меня есть аккаунт</span>
            <span class="group-hover:text-primary-300 text-neutral-700">
              Авторизация
            </span>
          </div>
        </Button>
      </Form>
    </Section>
  );
}
