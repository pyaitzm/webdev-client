"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as client from "../client";
import { useAccountContext } from "../AccountContext";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { setCurrentUser } = useAccountContext();
  const router = useRouter();

  const signin = async () => {
    setError("");
    try {
      const user = await client.signin(credentials);
      setCurrentUser(user);
      router.push("/dashboard");
    } catch (error) {
      setError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "Unable to sign in")
          : "Unable to sign in",
      );
    }
  };

  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      <input
        id="wd-username"
        className="wd-username"
        placeholder="username"
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
      />
      <br />
      <input
        id="wd-password"
        className="wd-password"
        placeholder="password"
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <br />
      <button type="button" onClick={signin} id="wd-signin-btn">
        Sign in
      </button>
      <br />
      <Link href="/account/signup" id="wd-signup-link">
        Sign up
      </Link>
    </div>
  );
}
