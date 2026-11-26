"use client";

import { useEffect, useState } from "react";
import * as client from "./client";

export default function HelloRoute() {
  const [hello, setHello] = useState<{ message?: string }>({});

  useEffect(() => {
    client.fetchHello().then(setHello);
  }, []);

  return (
    <div id="wd-hello-route">
      <h3>Hello Route</h3>
      <p>{hello.message}</p>
    </div>
  );
}
