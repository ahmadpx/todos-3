"use client";

import { Todo } from "@prisma/client";
import { useEffect, useState } from "react";

import "todomvc-app-css/index.css";

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const fetchTodos = async () => {
    return fetch("/api/todos")
      .then((res) => res.json())
      .then((todos) => setTodos(todos));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return { data: todos, refetch: fetchTodos };
}

export default function Home() {
  const [newTodo, setNewTodo] = useState<string>("");
  const { data, refetch } = useTodos();
  const [todos, setTodos] = useState<Todo[]>([]);
  const activeTodos = todos.filter((todo) => !todo.completed);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    if (data) {
      setTodos(data);
    }
  }, [data]);

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            value={newTodo}
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                const res = await fetch("/api/todos", {
                  method: "POST",
                  body: JSON.stringify({ title: newTodo, completed: false }),
                });

                if (res.ok) {
                  setNewTodo("");
                  refetch();
                }
              }
            }}
          />
        </header>

        {/* Should be hidden if no todos available */}
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {/* List items should get the class `editing` when editing and `completed` when marked as completed */}
            {todos.map((todo) => (
              <li className="todo" key={todo.id}>
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={async (e) => {
                      const res = await fetch(`/api/todos/${todo.id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                          title: todo.title,
                          completed: e.target.checked,
                        }),
                      });

                      if (res.ok) {
                        refetch();
                      }
                    }}
                  />
                  <label>{todo.title}</label>
                  <button
                    className="destroy"
                    onClick={async (e) => {
                      const res = await fetch(`/api/todos/${todo.id}`, {
                        method: "DELETE",
                      });

                      if (res.ok) {
                        refetch();
                      }
                    }}
                  ></button>
                </div>
                <input className="edit" value="Your todo" />
              </li>
            ))}
            {/* more todos here */}
          </ul>
        </section>

        {/* Should be hidden if no todos available */}
        <footer className="footer">
          {/* This should be `0 items left` by default */}
          <span className="todo-count">
            <strong>{activeTodos.length}</strong> items left
          </span>
          {/* Remove this if you don't implement routing */}
          <ul className="filters">
            <li>
              <a
                className={filter === "all" ? "selected" : ""}
                onClick={() => {
                  setFilter("all");
                  if (!data) return;
                  setTodos(data);
                }}
                href="#/"
              >
                All
              </a>
            </li>
            <li>
              <a
                href="#/active"
                className={filter === "active" ? "selected" : ""}
                onClick={() => {
                  setFilter("active");
                  if (!data) return;
                  setTodos(data.filter((todo) => !todo.completed));
                }}
              >
                Active
              </a>
            </li>
            <li>
              <a
                href="#/completed"
                className={filter === "completed" ? "selected" : ""}
                onClick={() => {
                  setFilter("completed");
                  if (!data) return;
                  setTodos(data.filter((todo) => todo.completed));
                }}
              >
                Completed
              </a>
            </li>
          </ul>
          {/* Hidden if no completed items are left ↓ */}
          <button
            className="clear-completed"
            onClick={async (e) => {
              const res = await fetch(`/api/todos/completed`, {
                method: "DELETE",
              });

              if (res.ok) {
                refetch();
              }
            }}
          >
            Clear completed
          </button>
        </footer>
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="#">Ahmed Abdallah</a>
        </p>
        <p>
          Inspired by <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
}
