"use client";

import { useState } from "react";
import axios from "axios";
import * as client from "../client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccountContext } from "../AccountContext";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setCurrentUser } = useAccountContext();
  const router = useRouter();

  const signup = async () => {
    if (!username || !password) return;
    setError("");
    try {
      const current = await client.signup({ username, password });
      setCurrentUser(current);
      router.push("/account/profile");
    } catch (error) {
      setError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "Unable to sign up")
          : "Unable to sign up",
      );
    }
  };

  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      <input
        id="wd-username"
        className="wd-username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        id="wd-password"
        className="wd-password"
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button type="button" onClick={signup} id="wd-signup-btn">
        Sign up
      </button>{" "}
      <br />
      <Link href="/account/signin" id="wd-signin-link">
        Sign in
      </Link>
    </div>
  );
}
