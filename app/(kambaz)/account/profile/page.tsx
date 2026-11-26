"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as client from "../client";
import { useAccountContext, type User } from "../AccountContext";

export default function Profile() {
  const { currentUser } = useAccountContext();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.push("/account/signin");
  }, [currentUser, router]);

  if (!currentUser) return null;
  return <ProfileForm key={currentUser._id} user={currentUser} />;
}

function ProfileForm({ user }: { user: User }) {
  const [profile, setProfile] = useState(user);
  // Date of birth is retained from the existing interface but isn't in users.json.
  const [dateOfBirth, setDateOfBirth] = useState("");
  const { setCurrentUser } = useAccountContext();
  const router = useRouter();

  const updateProfile = async () => {
    const user = await client.updateUser(profile);
    setCurrentUser(user);
    setProfile(user);
  };

  const signout = async () => {
    await client.signout();
    setCurrentUser(null);
    router.push("/account/signin");
  };

  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input
        id="wd-username"
        className="wd-username"
        placeholder="username"
        value={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />
      <br />
      <input
        id="wd-password"
        className="wd-password"
        placeholder="password"
        type="password"
        value={profile.password}
        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
      />
      <br />
      <input
        id="wd-firstname"
        placeholder="First Name"
        value={profile.firstName}
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
      />
      <br />
      <input
        id="wd-lastname"
        placeholder="Last Name"
        value={profile.lastName}
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
      />
      <br />
      <input
        id="wd-dob"
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
      />
      <br />
      <input
        id="wd-email"
        type="email"
        placeholder="Email"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />
      <br />
      <select
        id="wd-role"
        disabled
        value={profile.role}
        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
        <option value="TA">TA</option>
      </select>
      <br />
      <button type="button" id="wd-update-profile-btn" onClick={updateProfile}>
        Update
      </button>
      <br />
      <button type="button" onClick={signout} id="wd-signout-btn">
        Sign out
      </button>
    </div>
  );
}
