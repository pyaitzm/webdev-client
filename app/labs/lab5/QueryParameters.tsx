"use client";

import { useState } from "react";

export default function QueryParameters() {
  const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");

  const inputClass =
    "mb-2 block w-full rounded border border-neutral-300 px-3 py-1.5";
  const linkClass =
    "mb-2 block w-full rounded bg-blue-600 px-3 py-1.5 text-center text-sm font-medium text-white no-underline";

  return (
    <div id="wd-query-parameters">
      <h3>Query Parameters</h3>

      <input
        id="wd-query-parameter-a"
        type="number"
        value={a}
        onChange={(event) => setA(event.target.value)}
        className={inputClass}
      />
      <input
        id="wd-query-parameter-b"
        type="number"
        value={b}
        onChange={(event) => setB(event.target.value)}
        className={inputClass}
      />

      <a
        id="wd-query-parameter-add"
        href={`${HTTP_SERVER}/lab5/calculator?a=${a}&b=${b}&operation=add`}
        className={linkClass}
      >
        Add {a} + {b}
      </a>
      <a
        id="wd-query-parameter-subtract"
        href={`${HTTP_SERVER}/lab5/calculator?a=${a}&b=${b}&operation=subtract`}
        className={linkClass}
      >
        Subtract {a} - {b}
      </a>
      <a
        id="wd-query-parameter-multiply"
        href={`${HTTP_SERVER}/lab5/calculator?a=${a}&b=${b}&operation=multiply`}
        className={linkClass}
      >
        Multiply {a} × {b}
      </a>
      <a
        id="wd-query-parameter-divide"
        href={`${HTTP_SERVER}/lab5/calculator?a=${a}&b=${b}&operation=divide`}
        className={linkClass}
      >
        Divide {a} ÷ {b}
      </a>
    </div>
  );
}
