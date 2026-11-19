"use client";

import { useState } from "react";
import { useTodosContext } from "./todosContext";

export default function ReactContextTodoList() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodosContext();
  const [title, setTitle] = useState("");

  return (
    <section>
      <h3>Todo List</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          addTodo(title);
          setTitle("");
        }}
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              value={todo.title}
              onChange={(event) => updateTodo(todo.id, event.target.value)}
            />
            <button type="button" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
