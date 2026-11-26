"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import {
  emptyUser,
  useAccountContext,
  type User,
} from "../../../../account/AccountContext";
import * as users from "../../../../users/client";
import * as enrollments from "../../../../enrollments/client";

export default function PeopleTable() {
  const { cid } = useParams();
  const courseId = typeof cid === "string" ? cid : "";
  return <PeopleForCourse key={courseId} courseId={courseId} />;
}

function PeopleForCourse({ courseId }: { courseId: string }) {
  const { currentUser, setCurrentUser } = useAccountContext();
  const faculty = currentUser?.role === "FACULTY";
  const [enrolled, setEnrolled] = useState<users.Person[]>([]);
  const [person, setPerson] = useState<User>({ ...emptyUser });
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    if (!currentUser) {
      setPending(false);
      return;
    }
    users
      .findUsersForCourse(courseId)
      .then((data) => {
        if (active) setEnrolled(data);
      })
      .catch(() => {
        if (active) setError("Unable to load people");
      })
      .finally(() => {
        if (active) setPending(false);
      });
    return () => {
      active = false;
    };
  }, [courseId, currentUser]);

  const reset = () => {
    setPerson({ ...emptyUser });
    setEditing(false);
  };
  const savePerson = async () => {
    if (
      saving ||
      !person.firstName.trim() ||
      !person.lastName.trim() ||
      !person.username.trim() ||
      (!editing && !person.password)
    )
      return;
    setSaving(true);
    setError("");
    try {
      const { _id, password, ...fields } = person;
      const updates = password ? { ...fields, password } : fields;
      const saved = editing
        ? await users.updateUser(_id, updates)
        : await users.createUserForCourse(courseId, updates);
      if (saved._id === currentUser?._id) {
        setCurrentUser({
          ...currentUser,
          ...saved,
          password: password || currentUser.password,
        });
      }
      setEnrolled(await users.findUsersForCourse(courseId));
      reset();
    } catch {
      setError(
        "Unable to save person. Check the username and required fields.",
      );
    } finally {
      setSaving(false);
    }
  };
  const removePerson = async (userId: string, permanent: boolean) => {
    if (saving) return;
    if (permanent && !window.confirm("Delete this user from all courses?"))
      return;
    setSaving(true);
    setError("");
    try {
      if (permanent) await users.deleteUser(userId);
      else await enrollments.unenrollFromCourse(userId, courseId);
      setEnrolled((previous) => previous.filter((u) => u._id !== userId));
      if (person._id === userId) reset();
    } catch {
      setError("Unable to remove person");
    } finally {
      setSaving(false);
    }
  };
  if (!currentUser) return <p>Sign in to view course participants.</p>;
  if (pending) return <p>Loading people...</p>;
  return (
    <div id="wd-people-table" className="overflow-x-auto">
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      {faculty && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input
            aria-label="First name"
            placeholder="First name"
            className="rounded border border-neutral-300 px-3 py-1.5"
            value={person.firstName}
            onChange={(e) =>
              setPerson({ ...person, firstName: e.target.value })
            }
          />
          <input
            aria-label="Last name"
            placeholder="Last name"
            className="rounded border border-neutral-300 px-3 py-1.5"
            value={person.lastName}
            onChange={(e) => setPerson({ ...person, lastName: e.target.value })}
          />
          <input
            aria-label="Username"
            placeholder="Username"
            className="rounded border px-3 py-1.5"
            value={person.username}
            onChange={(e) => setPerson({ ...person, username: e.target.value })}
          />
          <input
            aria-label="Password"
            placeholder={editing ? "New password (optional)" : "Password"}
            type="password"
            className="rounded border px-3 py-1.5"
            value={person.password}
            onChange={(e) => setPerson({ ...person, password: e.target.value })}
          />
          <input
            aria-label="Email"
            placeholder="Email"
            className="rounded border px-3 py-1.5"
            value={person.email}
            onChange={(e) => setPerson({ ...person, email: e.target.value })}
          />
          <input
            aria-label="Login ID"
            placeholder="Login ID"
            className="rounded border px-3 py-1.5"
            value={person.loginId}
            onChange={(e) => setPerson({ ...person, loginId: e.target.value })}
          />
          <input
            aria-label="Section"
            placeholder="Section"
            className="rounded border px-3 py-1.5"
            value={person.section}
            onChange={(e) => setPerson({ ...person, section: e.target.value })}
          />
          <select
            aria-label="Role"
            className="rounded border px-3 py-1.5"
            value={person.role}
            disabled={person._id === currentUser._id}
            onChange={(e) => setPerson({ ...person, role: e.target.value })}
          >
            {["STUDENT", "FACULTY", "TA", "ADMIN", "USER"].map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <button
            type="button"
            className="rounded bg-blue-600 px-3 py-1.5 text-white"
            disabled={saving}
            onClick={savePerson}
          >
            {editing ? "Update Person" : "Add Person"}
          </button>
          {editing && (
            <button type="button" disabled={saving} onClick={reset}>
              Cancel
            </button>
          )}
        </div>
      )}
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Name</th>
            <th className="p-2">Login ID</th>
            <th className="p-2">Section</th>
            <th className="p-2">Role</th>
            <th className="p-2">Last Activity</th>
            <th className="p-2">Total Activity</th>
            <th className="p-2">Enrollment</th>
          </tr>
        </thead>
        <tbody>
          {enrolled.map((user) => (
            <tr key={user._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2 text-nowrap">
                <FaUserCircle className="me-2 inline align-middle text-3xl text-neutral-500" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id p-2">{user.loginId}</td>
              <td className="wd-section p-2">{user.section}</td>
              <td className="wd-role p-2">{user.role}</td>
              <td className="wd-last-activity p-2">{user.lastActivity}</td>
              <td className="wd-total-activity p-2">{user.totalActivity}</td>
              <td className="p-2">
                {faculty && (
                  <button
                    type="button"
                    disabled={saving}
                    className="me-2 rounded bg-yellow-400 px-2 py-1"
                    onClick={() => {
                      setPerson({ ...user, password: "" });
                      setEditing(true);
                    }}
                  >
                    Edit
                  </button>
                )}
                {(faculty || user._id === currentUser._id) && (
                  <button
                    type="button"
                    disabled={saving}
                    className="me-2 rounded bg-red-600 px-2 py-1 text-white"
                    onClick={() => removePerson(user._id, false)}
                  >
                    Unenroll
                  </button>
                )}
                {faculty && user._id !== currentUser._id && (
                  <button
                    type="button"
                    disabled={saving}
                    className="rounded bg-red-600 px-2 py-1 text-white"
                    onClick={() => removePerson(user._id, true)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
