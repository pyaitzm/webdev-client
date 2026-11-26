"use client";
import { create } from "zustand";
export type Enrollment = { _id: string; user: string; course: string };
export const useEnrollmentsStore = create<{
  enrollments: Enrollment[];
  setEnrollments: (enrollments: Enrollment[]) => void;
}>((set) => ({
  enrollments: [],
  setEnrollments: (enrollments) => set({ enrollments }),
}));
