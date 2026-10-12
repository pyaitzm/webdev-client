import Link from "next/link";

export default function AccountNavigation() {
  return (
    <div id="wd-account-navigation">
      <Link href="/account/signin">SignIn</Link> <br />
      <Link href="/account/signup">SignUp</Link> <br />
      <Link href="/account/profile">Profile</Link> <br />
    </div>
  );
}
