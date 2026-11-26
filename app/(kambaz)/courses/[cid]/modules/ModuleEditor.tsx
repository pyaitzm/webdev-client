import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function ModuleEditor({
  onAddModule,
}: {
  onAddModule: (name: string) => Promise<boolean>;
}) {
  const [show, setShow] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAddModule() {
    const name = moduleName.trim();
    if (!name || saving) return;
    setSaving(true);
    if (await onAddModule(name)) {
      setModuleName("");
      setShow(false);
    }
    setSaving(false);
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
        id="wd-add-module-btn"
        onClick={() => setShow(true)}
      >
        <FaPlus /> Module
      </button>
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          id="wd-add-module-dialog"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wd-add-module-title"
            className="w-full max-w-md rounded-lg bg-white shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <h3
                id="wd-add-module-title"
                className="m-0 text-lg font-semibold"
              >
                Add Module
              </h3>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="text-2xl leading-none text-neutral-500"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-4 py-3">
              <input
                className="w-full rounded border border-neutral-300 px-3 py-1.5"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                id="wd-add-module-name"
                placeholder="Module name"
              />
            </div>
            <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="rounded bg-neutral-300 px-3 py-1.5 text-sm"
                id="wd-add-module-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddModule}
                disabled={!moduleName.trim() || saving}
                className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                id="wd-add-module-submit"
              >
                Add Module
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
