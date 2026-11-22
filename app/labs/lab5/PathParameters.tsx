"use client";

import { useState } from "react";

export default function PathParameters() {
  const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");

  const inputClass =
    "mb-2 block w-full rounded border border-neutral-300 px-3 py-1.5";
  const linkClass =
    "mb-2 block w-full rounded bg-blue-600 px-3 py-1.5 text-center text-sm font-medium text-white no-underline";

  return (
    <div id="wd-path-parameters">
      <h3>Path Parameters</h3>

      <input
        id="wd-path-parameter-a"
        type="number"
        value={a}
        onChange={(event) => setA(event.target.value)}
        className={inputClass}
      />
      <input
        id="wd-path-parameter-b"
        type="number"
        value={b}
        onChange={(event) => setB(event.target.value)}
        className={inputClass}
      />

      <a
        id="wd-path-parameter-add"
        href={`${HTTP_SERVER}/lab5/add/${a}/${b}`}
        className={linkClass}
      >
        Add {a} + {b}
      </a>
      <a
        id="wd-path-parameter-subtract"
        href={`${HTTP_SERVER}/lab5/subtract/${a}/${b}`}
        className={linkClass}
      >
        Subtract {a} - {b}
      </a>
      <a
        id="wd-path-parameter-multiply"
        href={`${HTTP_SERVER}/lab5/multiply/${a}/${b}`}
        className={linkClass}
      >
        Multiply {a} × {b}
      </a>
      <a
        id="wd-path-parameter-divide"
        href={`${HTTP_SERVER}/lab5/divide/${a}/${b}`}
        className={linkClass}
      >
        Divide {a} ÷ {b}
      </a>
    </div>
  );
}
