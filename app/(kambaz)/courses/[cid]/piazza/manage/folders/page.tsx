"use client";

import { useParams } from "next/navigation";
import { useAccountContext } from "../../../../../account/AccountContext";
import { useCoursesStore } from "../../../../../store/coursesStore";
import ManageClass from "../../member-b/ManageClass";
import { defaultFolderNames, mockPazzaFolders } from "../../shared/mockData";
import type { PazzaFolder, PazzaUser } from "../../shared/types";

/** Use the existing Kambaz account, without exposing its password to Pazza. */
function toPazzaUser(
  user: ReturnType<typeof useAccountContext>["currentUser"],
): PazzaUser | null {
  if (!user) return null;
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as PazzaUser["role"],
  };
}

/** Instructor-only class administration; data is temporary until persistence is added. */
export default function ManageFoldersPage() {
  const params = useParams();
  const courseId = typeof params.cid === "string" ? params.cid : "";
  const courses = useCoursesStore((state) => state.courses);
  const { currentUser } = useAccountContext();
  const course = courses.find((item) => item._id === courseId);
  const user = toPazzaUser(currentUser);

  if (!course) {
    return (
      <p className="rounded bg-amber-50 p-4 text-amber-900">
        Course not found.
      </p>
    );
  }

  if (!user || !["FACULTY", "TA", "ADMIN"].includes(user.role)) {
    return (
      <main className="rounded border border-amber-200 bg-amber-50 p-5">
        <h1 className="text-xl font-semibold text-amber-950">
          Instructor access required
        </h1>
        <p className="mt-2 text-amber-900">
          You do not have permission to manage folders for this course.
        </p>
      </main>
    );
  }

  // Preserve the existing RS101/RS102 fixtures; provide the same default folders
  // for other Kambaz courses without changing the shared mock-data contracts.
  const courseFolders = mockPazzaFolders.filter(
    (folder) => folder.courseId === courseId,
  );
  const folders: PazzaFolder[] = courseFolders.length
    ? courseFolders
    : defaultFolderNames.map((name, index) => ({
        _id: `fixture-${courseId}-folder-${index + 1}`,
        courseId,
        name,
      }));

  return (
    <ManageClass
      course={{ _id: course._id, name: course.name }}
      currentUser={user}
      folders={folders}
    />
  );
}
