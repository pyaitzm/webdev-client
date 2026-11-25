"use client";

import type { FolderFiltersProps } from "./shared/componentContracts";

export default function FolderFilters({
  folders,
  selectedFolderId,
  onSelectFolder,
}: FolderFiltersProps) {
  return (
    <nav
      aria-label="Pazza folder filters"
      className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm"
    >
      <span className="mr-1 font-semibold text-gray-700">Folders</span>
      <button
        type="button"
        aria-pressed={selectedFolderId === null}
        onClick={() => onSelectFolder(null)}
        className={`rounded px-3 py-1.5 ${selectedFolderId === null ? "bg-blue-800 font-semibold text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"}`}
      >
        All Folders
      </button>
      {folders.map((folder) => (
        <button
          key={folder._id}
          type="button"
          aria-pressed={selectedFolderId === folder._id}
          onClick={() => onSelectFolder(folder._id)}
          className={`rounded px-3 py-1.5 ${selectedFolderId === folder._id ? "bg-blue-800 font-semibold text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"}`}
        >
          {folder.name}
        </button>
      ))}
    </nav>
  );
}
