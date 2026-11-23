"use client";

import type { PazzaCourse, PazzaFolder, PazzaUser } from "../shared/types";
import ManageFolders from "./ManageFolders";

type Props = { course: PazzaCourse; currentUser: PazzaUser | null; folders: PazzaFolder[]; onFoldersChanged?: () => void };

/** Member B's route body. Member A links this screen from the Pazza navigation. */
export default function ManageClass(props: Props) {
  const instructor = ["FACULTY", "TA", "ADMIN"].includes(props.currentUser?.role ?? "");
  return <main id="wd-pazza-manage-class" className="mx-auto max-w-4xl space-y-5"><header><p className="text-sm font-medium text-red-700">Pazza · {props.course.name}</p><h1 className="text-2xl font-semibold">Manage Class</h1></header>{instructor ? <ManageFolders {...props} /> : <section className="rounded border border-amber-200 bg-amber-50 p-4"><h2 className="font-semibold text-amber-900">Instructor access required</h2><p className="mt-1 text-sm text-amber-900">Students cannot access class-administration operations.</p></section>}</main>;
}
