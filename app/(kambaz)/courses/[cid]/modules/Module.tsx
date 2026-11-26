import { FaGripVertical } from "react-icons/fa";
import ModuleControlButtons from "./ModuleControlButtons";
import Lesson from "./Lesson";
import type { CourseModule } from "../../../store/modulesStore";

export default function Module({
  module,
  onRemoveModule,
  onUpdateModule,
}: {
  module: CourseModule;
  onRemoveModule: (moduleId: string) => Promise<void>;
  onUpdateModule: (module: Pick<CourseModule, "_id" | "name">) => Promise<void>;
}) {
  return (
    <li className="wd-module mb-5 overflow-hidden border border-neutral-400 p-0 text-xl">
      <div className="wd-title flex items-center gap-3 bg-neutral-300 p-3 ps-2">
        <FaGripVertical
          className="shrink-0 text-neutral-800"
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          {module.editing ? (
            <input
              className="w-1/2 min-w-0 rounded border border-neutral-200 bg-white px-3 py-1.5 text-xl"
              defaultValue={module.name}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void onUpdateModule({
                    _id: module._id,
                    name: e.currentTarget.value,
                  });
                }
              }}
              aria-label="Module name"
            />
          ) : (
            module.name
          )}
        </span>
        <ModuleControlButtons
          moduleId={module._id}
          onRemoveModule={onRemoveModule}
        />
      </div>
      <ul className="wd-lessons m-0 list-none p-0">
        {module.lessons?.map((lesson) => (
          <Lesson key={lesson._id} title={lesson.name} />
        ))}
      </ul>
    </li>
  );
}
