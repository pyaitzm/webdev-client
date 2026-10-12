import Link from "next/link";

export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h3>Sign In</h3>
      <input
        placeholder="username"
        className="wd-username"
        defaultValue="ada"
      />
      <br />
      <input
        placeholder="password"
        type="password"
        className="wd-password"
        defaultValue="123"
      />
      <br />
      <Link href="/dashboard" id="wd-signin-btn">
        Sign In
      </Link>
      <br />
      <Link href="/account/signup" id="wd-signup-link">
        Sign Up
      </Link>
    </div>
  );
}
