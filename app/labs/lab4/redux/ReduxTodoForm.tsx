import type { FormEvent } from "react";

type Props = {
  title: string;
  editing: boolean;
  onTitleChange: (title: string) => void;
  onSubmit: () => void;
};

export default function ReduxTodoForm({
  title,
  editing,
  onTitleChange,
  onSubmit,
}: Props) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      id="wd-redux-todo-form"
      className="mb-2 flex flex-wrap gap-2"
      onSubmit={handleSubmit}
    >
      <input
        id="wd-redux-todo-title"
        className="rounded border border-neutral-300 px-2 py-1"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
      />

      <button
        type="submit"
        id="wd-redux-add-todo"
        className="rounded bg-green-600 px-3 py-1.5 text-sm text-white"
      >
        {editing ? "Update" : "Add"}
      </button>
    </form>
  );
}
