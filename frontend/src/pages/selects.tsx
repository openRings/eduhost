import { Select, type SelectOption } from "../shared/uikit/Select";

const items: SelectOption[] = [
  { label: "Vue", value: "vue" },
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Svelte", value: "svelte", disabled: true },
];

export default function () {
  return (
    <div class="gap-xl my-32 flex flex-col items-center">
      <Select items={items} label="Фреймворк" placeholder="Выберите" />
      <Select items={items} placeholder="Выберите" size="sm" />
      <Select items={items} placeholder="Выберите" disabled />
    </div>
  );
}
