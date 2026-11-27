"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// React Quill is browser-only; load it in this Client Component.
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  return (
    <div
      aria-labelledby="pazza-post-details-label"
      className="rounded border border-gray-300 bg-white"
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder="Enter post details"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link"],
            ["clean"],
          ],
        }}
      />
    </div>
  );
}
