import { Input } from "../shared/uikit/Input";

export default function () {
  return (
    <div class="gap-xl my-32 flex flex-col items-center">
      <Input placeholder="Введите текст" onclear={() => console.log(123)} />
      <Input placeholder="Введите текст" disabled />
    </div>
  );
}
