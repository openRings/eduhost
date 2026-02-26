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

export default function () {
  return (
    <section class="gap-3xl m-auto flex min-h-full min-w-90 flex-col justify-center px-0">
      <h2 class="text text-left text-2xl text-neutral-500">
        Создание аккаунта
      </h2>
      <div class="gap-md flex flex-col">
        <Field icon={<Contact />} description="Юзернейм">
          <Input placeholder="Придумайте себе юзернейм" />
        </Field>
        <Field icon={<ALargeSmall />} description="Имя">
          <Input placeholder="Введите ваше имя" />
        </Field>
        <Field icon={<ALargeSmall />} description="Фамилия">
          <Input placeholder="ПВведите вашу фамилию" />
        </Field>
        <Field icon={<ALargeSmall />} description="Отчество" optional={true}>
          <Input placeholder="Введите ваше отчество, если есть" />
        </Field>
        <Field icon={<KeyRound />} description="Пароль">
          <Input placeholder="Придумайте сложный пароль" />
        </Field>
        <Field icon={<BadgeCheck />} description="Подтверждение пароля">
          <Input placeholder="Повторите пароль" />
        </Field>
      </div>
      <div class="gap-md flex">
        <Button iconStart={<BrushCleaning />}> Очистить</Button>
        <Button iconStart={<UserPlus />} class="grow" variant="primary">
          {" "}
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
