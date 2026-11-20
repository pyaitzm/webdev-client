"use client";

import { create } from "zustand";
import assignmentsJson from "../database/assignments.json";

// The original JSON has no "until" date; retain that field when users add it.
export type Assignment = (typeof assignmentsJson)[number] & {
  until?: string;
};

export type AssignmentDraft = Omit<Assignment, "_id">;

type AssignmentsStore = {
  assignments: Assignment[];
  addAssignment: (assignment: AssignmentDraft) => void;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (assignmentId: string) => void;
};

export const useAssignmentsStore = create<AssignmentsStore>((set) => ({
  assignments: assignmentsJson,
  addAssignment: (assignment) =>
    set((state) => ({
      assignments: [
        ...state.assignments,
        { ...assignment, _id: crypto.randomUUID() },
      ],
    })),
  updateAssignment: (assignment) =>
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a._id === assignment._id && a.course === assignment.course
          ? assignment
          : a,
      ),
    })),
  deleteAssignment: (assignmentId) =>
    set((state) => ({
      assignments: state.assignments.filter((a) => a._id !== assignmentId),
    })),
}));
