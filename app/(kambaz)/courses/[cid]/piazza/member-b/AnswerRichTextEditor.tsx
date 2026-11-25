"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export const isRichTextBlank = (value: string) =>
  !value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();

export default function AnswerRichTextEditor({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div aria-label={label} className="mt-2 rounded border border-slate-300 bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder="Write an answer…"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        }}
      />
    </div>
  );
}
