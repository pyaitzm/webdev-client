"use client";

import { useParams } from "next/navigation";
import { useAccountContext } from "../../../../../account/AccountContext";
import ManageClass from "../../member-b/ManageClass";
import { mockPazzaCourses, mockPazzaFolders, mockPazzaUsers } from "../../shared/mockData";
import type { PazzaUser } from "../../shared/types";

const toPazzaUser = (user: ReturnType<typeof useAccountContext>["currentUser"]): PazzaUser | null =>
  user
    ? {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as PazzaUser["role"],
      }
    : null;

/** Directly protected instructor-only Manage Class / Manage Folders route. */
export default function ManageFoldersPage() {
  const params = useParams();
  const courseId = typeof params.cid === "string" ? params.cid : "";
  const { currentUser } = useAccountContext();
  const course = mockPazzaCourses.find((item) => item._id === courseId);
  const user = toPazzaUser(currentUser) ?? mockPazzaUsers.find((item) => item._id === "678") ?? null;

  if (!course) return <p className="rounded bg-amber-50 p-4 text-amber-900">Course not found.</p>;

  // Signed-out visitors and students cannot use this URL directly.
  if (!currentUser || !["FACULTY", "TA", "ADMIN"].includes(user?.role ?? "")) {
    return <main className="rounded border border-amber-200 bg-amber-50 p-5"><h1 className="text-xl font-semibold text-amber-950">Instructor access required</h1><p className="mt-2 text-amber-900">You do not have permission to manage folders for this course.</p></main>;
  }

  return <ManageClass course={course} currentUser={user} folders={mockPazzaFolders} />;
}
