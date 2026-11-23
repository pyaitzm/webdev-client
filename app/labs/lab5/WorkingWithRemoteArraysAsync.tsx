"use client";

import * as client from "./client";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaTrash } from "react-icons/fa";

type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export default function WorkingWithRemoteArraysAsync() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    setTodos(await client.fetchTodos());
  };
  const removeTodo = async (todo: Todo) => {
    setTodos(await client.removeTodo(todo));
  };
  const createNewTodo = async () => {
    setTodos(await client.createNewTodo());
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div id="wd-working-with-remote-arrays-async">
      <h3>Working With Arrays Asynchronously</h3>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} readOnly />
            <span className={todo.completed ? "line-through" : ""}>
              {todo.title}
            </span>{" "}
            <FaTrash
              onClick={() => removeTodo(todo)}
              id="wd-remove-todo"
              className="cursor-pointer text-red-600"
            />
            <FaPlusCircle
              onClick={createNewTodo}
              id="wd-create-todo"
              className="cursor-pointer text-green-600"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
