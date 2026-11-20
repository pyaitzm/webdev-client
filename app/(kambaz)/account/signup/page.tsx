"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccountContext } from "../AccountContext";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useAccountContext();
  const router = useRouter();

  const signup = () => {
    if (!username || !password) return;
    setCurrentUser({
      _id: crypto.randomUUID(),
      username,
      password,
      firstName: "",
      lastName: "",
      email: "",
      role: "STUDENT",
      loginId: "",
      section: "",
      lastActivity: "",
      totalActivity: "",
    });
    router.push("/account/profile");
  };

  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
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
