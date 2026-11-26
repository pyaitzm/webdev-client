"use client";

import * as client from "./client";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaPlusCircle, FaTrash } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import axios from "axios";

type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  editing?: boolean;
};

export default function WorkingWithRemoteArraysAsync() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTodos = async () => {
    setTodos(await client.fetchTodos());
  };
  const removeTodo = async (todo: Todo) => {
    setTodos(await client.removeTodo(todo));
  };
  const createNewTodo = async () => {
    setTodos(await client.createNewTodo());
  };
  const postNewTodo = async () => {
    const newTodo = await client.postNewTodo({
      title: "New Posted Todo",
      completed: false,
    });
    setTodos([...todos, newTodo]);
  };
  const deleteTodo = async (todo: Todo) => {
    try {
      await client.deleteTodo(todo);
      setTodos(todos.filter((t) => t.id !== todo.id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ?? "Unable to delete todo",
        );
      } else {
        setErrorMessage("Unable to delete todo");
      }
    }
  };
  const editTodo = (todo: Todo) => {
    setTodos(
      todos.map((t) => (t.id === todo.id ? { ...todo, editing: true } : t)),
    );
  };
  const updateTodo = async (todo: Todo) => {
    await client.updateTodo(todo);
    setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
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
            {todo.editing ? (
              <input
                autoFocus
                value={todo.title}
                onChange={(e) =>
                  setTodos(
                    todos.map((t) =>
                      t.id === todo.id ? { ...t, title: e.target.value } : t,
                    ),
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void updateTodo({
                      ...todo,
                      title: e.currentTarget.value,
                      editing: false,
                    });
                  }
                }}
              />
            ) : (
              <span className={todo.completed ? "line-through" : ""}>
                {todo.title}
              </span>
            )}{" "}
            <FaTrash
              onClick={() => removeTodo(todo)}
              id="wd-remove-todo"
              className="cursor-pointer text-red-600"
            />{" "}
            <TiDelete
              onClick={() => deleteTodo(todo)}
              id="wd-delete-todo"
              className="cursor-pointer text-2xl text-red-600"
            />{" "}
            <FaPlusCircle
              onClick={createNewTodo}
              id="wd-create-todo"
              className="cursor-pointer text-green-600"
            />{" "}
            <FaPlusCircle
              onClick={postNewTodo}
              id="wd-post-todo"
              className="cursor-pointer text-blue-600"
            />{" "}
            <FaPencilAlt
              onClick={() => editTodo(todo)}
              className="cursor-pointer text-blue-600"
            />
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) =>
                updateTodo({ ...todo, completed: e.target.checked })
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
