import { BrushCleaning } from "lucide-solid";
import { Input } from "../shared/uikit/Input";
import { Button } from "../shared/uikit/Button";

export default function () {
  return (
    <div class="gap-xl my-32 flex flex-col items-center">
      <div class="gap-xs flex">
        <Input placeholder="Введите текст" />
        <Button
          iconStart={<BrushCleaning />}
          onclick={() => console.log(123)}
        />
      </div>
      <Input placeholder="Введите текст" disabled />
    </div>
  );
}
