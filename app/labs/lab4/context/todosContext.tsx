"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Todo = { id: number; title: string };

type TodosContextValue = {
  todos: Todo[];
  addTodo: (title: string) => void;
  updateTodo: (id: number, title: string) => void;
  deleteTodo: (id: number) => void;
};

const TodosContext = createContext<TodosContextValue | null>(null);

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setTodos((current) => [
      ...current,
      { id: Date.now(), title: trimmedTitle },
    ]);
  };

  const updateTodo = (id: number, title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, title: trimmedTitle } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  return (
    <TodosContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo }}>
      {children}
    </TodosContext.Provider>
  );
}

export function useTodosContext() {
  const value = useContext(TodosContext);
  if (!value) {
    throw new Error("useTodosContext must be used inside TodosProvider");
  }
  return value;
}
