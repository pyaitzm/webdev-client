"use client";

import { useState } from "react";

const operations = ["add", "subtract", "multiply", "divide"] as const;
type Operation = (typeof operations)[number];

type Calculation = {
  a: number;
  b: number;
  operation: Operation;
  result: number;
};

type CalculatorResponse = Calculation | { error: string };

const symbols: Record<Operation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

export default function CalculatorNextWebApiClient() {
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");
  const [operation, setOperation] = useState<Operation>("add");
  const [result, setResult] = useState<Calculation | null>(null);
  const [error, setError] = useState("");

  const inputClass =
    "mb-2 block w-full rounded border border-neutral-300 px-3 py-1.5";

  async function calculate(selectedOperation: Operation = operation) {
    setError("");
    setResult(null);

    const params = new URLSearchParams({
      a,
      b,
      operation: selectedOperation,
    });

    try {
      const response = await fetch(`/api/lab5/calculator?${params}`);
      const data: CalculatorResponse = await response.json();

      if ("error" in data) {
        setError(data.error);
        return;
      }

      if (!response.ok) {
        setError(`Request failed (${response.status})`);
        return;
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Calculator request failed",
      );
    }
  }

  return (
    <div id="wd-calculator-next-web-api">
      <h3>Calculator (Next.js Web API)</h3>

      <input
        aria-label="First number"
        type="number"
        value={a}
        onChange={(event) => setA(event.target.value)}
        className={inputClass}
      />
      <input
        aria-label="Second number"
        type="number"
        value={b}
        onChange={(event) => setB(event.target.value)}
        className={inputClass}
      />

      <select
        aria-label="Operation"
        value={operation}
        onChange={(event) => {
          const nextOperation = event.target.value as Operation;
          setOperation(nextOperation);
          void calculate(nextOperation);
        }}
        className={inputClass}
      >
        {operations.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => void calculate()}
        className="mb-2 rounded bg-blue-600 px-3 py-1.5 text-white"
      >
        Calculate
      </button>

      <input
        aria-label="Calculation result"
        readOnly
        value={
          result
            ? `${result.a} ${symbols[result.operation]} ${result.b} = ${result.result}`
            : ""
        }
        className={inputClass}
      />

      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
