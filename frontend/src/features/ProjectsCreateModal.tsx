import { Book, Plus, Tag } from "lucide-solid";
import { createMemo, createResource, Show } from "solid-js";
import { fetchSubjects } from "../entities/subjects";
import z from "zod";
import { createForm } from "../shared/Form";
import Modal from "../shared/Modal";
import { Skeleton } from "../shared/Skeleton";
import { currentGroupId } from "../utils/group";

const CreateProjectFormData = z.object({
  name: z.string().min(1, "Введите название"),
  label: z.string().min(1, "Введите лейбл"),
  subjectId: z.string().min(1, "Выберите предмет"),
});

export type ProjectsCreateModalProps = {
  isOpen: boolean;
  selectedSubjectId?: string;
  onclose: () => void;
};

export function ProjectsCreateModal(props: ProjectsCreateModalProps) {
  const { Form } = createForm(CreateProjectFormData, {
    subjectId: props.selectedSubjectId ?? "",
  });

  const subjectsQuery = createMemo(() => {
    if (!props.isOpen) return "";
    return currentGroupId();
  });

  const [subjects] = createResource(subjectsQuery, async (groupId) => {
    if (!groupId) return [];
    const data = await fetchSubjects(groupId);
    return data.map((subject) => ({ id: subject.id, name: subject.name }));
  });

  const subjectItems = () =>
    (subjects() ?? []).map((subject) => ({
      value: subject.id,
      label: subject.name,
    }));

  const createProject = async () => {
    props.onclose();
  };

  return (
    <Modal
      title="Создать проект"
      isOpen={props.isOpen}
      class="h-96 w-104"
      onclose={props.onclose}
    >
      <Form class="gap-md flex h-full flex-col" onsubmit={createProject}>
        <Form.Field
          name="name"
          label="Название"
          icon={<Book />}
          placeholder="Введите название проекта"
        />
        <Form.Field
          name="label"
          label="Лейбл"
          icon={<Tag />}
          placeholder="Введите лейбл проекта"
        />
        <Show when={subjects.loading}>
          <div class="gap-xs pl-md flex w-full flex-col">
            <span class="text-xs text-neutral-500">Предмет</span>
            <Skeleton class="h-8 w-full" radius="sm" />
          </div>
        </Show>
        <Show when={!subjects.loading}>
          <Form.Select
            name="subjectId"
            label="Предмет"
            icon={<Book />}
            placeholder="Выберите предмет"
            autosize={false}
            items={subjectItems()}
          />
        </Show>
        <div class="gap-sm mt-auto flex">
          <Form.Clear />
          <Form.Submit
            variant="primary"
            class="grow"
            iconStart={<Plus />}
            disabled={subjects.loading}
          >
            Создать
          </Form.Submit>
        </div>
      </Form>
    </Modal>
  );
}
