import z from "zod";
import { createForm } from "../shared/Form";
import { Section } from "../shared/Section";
import { Contact, KeyRound, LogIn } from "lucide-solid";
import { Button } from "../shared/uikit/Button";
import { fetchApi } from "../utils/api";
import { error, success } from "../utils/notifications";
import { useLocation, useNavigate } from "@solidjs/router";

const SigninForm = z.object({
  username: z.string().min(4).max(12).lowercase(),
  password: z.string(),
});

export default function () {
  const location = useLocation();
  const navigate = useNavigate();

  const { Form } = createForm(SigninForm, {
    username: (location.state ?? ({} as any)).username,
    password: (location.state ?? ({} as any)).password,
  });

  const signin = async (data: z.infer<typeof SigninForm>) => {
    const { status } = await fetchApi("/auth/signin", {
      method: "POST",
      authRedirect: false,
      body: data,
    });

    if (status == 403) error("Неверный логин или пароль");
    if (status == 200) {
      success("Успешная авторизация");
      navigate("/");
    }
  };

  return (
    <Section class="h-screen items-center justify-center">
      <Form class="gap-3xl flex w-[360px] flex-col" onsubmit={signin}>
        <h1 class="text-lg text-neutral-400">Вход в аккаунт</h1>
        <div class="gap-md flex flex-col">
          <Form.Field
            name="username"
            label="Юзернейм"
            icon={<Contact />}
            placeholder="Введите ваш юзернейм"
          />
          <Form.Field
            name="password"
            label="Пароль"
            type="password"
            icon={<KeyRound />}
            placeholder="Введите ваш пароль"
          />
        </div>
        <div class="gap-md flex">
          <Form.Clear></Form.Clear>
          <Form.Submit
            title="Войти в аккаунт"
            pendingText="Вход.."
            class="grow"
            variant="primary"
            iconStart={<LogIn />}
          >
            Войти
          </Form.Submit>
        </div>
        <Button variant="lined" class="h-[96px]" href="/signup">
          <div class="gap-md flex flex-col items-center">
            <span class="text-neutral-500">У меня нет аккаунта</span>
            <span class="group-hover:text-primary-300 text-neutral-700">
              Регистрация
            </span>
          </div>
        </Button>
      </Form>
    </Section>
  );
}
