import { createStore } from "solid-js/store";
import { Input } from "../shared/uikit/Input";
import { Field } from "../shared/uikit/Field";
import { Button } from "../shared/uikit/Button";
import {
  Contact,
  ALargeSmall,
  KeyRound,
  BadgeCheck,
  BrushCleaning,
  UserPlus,
} from "lucide-solid";

type SignupForm = {
  username: string;
  name: string;
  lastName: string;
  middleName?: string;
  password: string;
  passwordRepeat: string;
};

type SignupErrors = Partial<Record<keyof SignupForm, string>>;

export default function () {
  const initialForm: SignupForm = {
    username: "",
    name: "",
    lastName: "",
    middleName: "",
    password: "",
    passwordRepeat: "",
  };

  const [form, setForm] = createStore<SignupForm>({
    username: "",
    name: "",
    lastName: "",
    middleName: "",
    password: "",
    passwordRepeat: "",
  });

  const [errors, setErrors] = createStore<SignupErrors>({});

  return (
    <section class="gap-3xl m-auto flex min-h-full min-w-90 flex-col justify-center px-0">
      <h2 class="text text-left text-2xl text-neutral-500">
        Создание аккаунта
      </h2>
      <div class="gap-md flex flex-col">
        <Field
          icon={<Contact />}
          description="Юзернейм"
          error={errors.username}
        >
          <Input
            placeholder="Придумайте себе юзернейм"
            value={form.username}
            oninput={(e) => setForm("username", e.currentTarget.value)}
          />
        </Field>
        <Field icon={<ALargeSmall />} description="Имя" error={errors.name}>
          <Input
            placeholder="Введите ваше имя"
            value={form.name}
            oninput={(e) => setForm("name", e.currentTarget.value)}
          />
        </Field>
        <Field
          icon={<ALargeSmall />}
          description="Фамилия"
          error={errors.lastName}
        >
          <Input
            placeholder="Введите вашу фамилию"
            value={form.lastName}
            oninput={(e) => setForm("lastName", e.currentTarget.value)}
          />
        </Field>
        <Field
          icon={<ALargeSmall />}
          description="Отчество"
          optional={true}
          error={errors.middleName}
        >
          <Input
            placeholder="Введите ваше отчество, если есть"
            value={form.middleName}
            oninput={(e) => setForm("middleName", e.currentTarget.value)}
          />
        </Field>
        <Field icon={<KeyRound />} description="Пароль" error={errors.password}>
          <Input
            placeholder="Придумайте сложный пароль"
            value={form.password}
            oninput={(e) => setForm("password", e.currentTarget.value)}
          />
        </Field>
        <Field
          icon={<BadgeCheck />}
          description="Подтверждение пароля"
          error={errors.passwordRepeat}
        >
          <Input
            placeholder="Повторите пароль"
            value={form.passwordRepeat}
            oninput={(e) => setForm("passwordRepeat", e.currentTarget.value)}
          />
        </Field>
      </div>
      <div class="gap-md flex">
        <Button
          iconStart={<BrushCleaning />}
          onClick={() => setForm(() => ({ ...initialForm }))}
        >
          Очистить
        </Button>
        <Button iconStart={<UserPlus />} class="grow" variant="primary">
          Создать
        </Button>
      </div>
      <Button variant="lined" class="min-h-24">
        <div class="gap-md flex flex-col">
          <span>У меня есть аккаунт</span>
          <a class="text-neutral-700">Авторизация</a>
        </div>
      </Button>
    </section>
  );
}
