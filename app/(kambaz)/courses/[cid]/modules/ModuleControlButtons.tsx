import { FaCheckCircle, FaPencilAlt, FaTrash } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { useModulesStore } from "../../../store/modulesStore";

export default function ModuleControlButtons({
  moduleId,
  onRemoveModule,
}: {
  moduleId: string;
  onRemoveModule: (moduleId: string) => Promise<void>;
}) {
  const editModule = useModulesStore((state) => state.editModule);

  return (
    <div className="flex shrink-0 items-center gap-3">
      <button
        type="button"
        onClick={() => editModule(moduleId)}
        title="Edit module"
        aria-label="Edit module"
        className="cursor-pointer text-blue-600"
      >
        <FaPencilAlt />
      </button>
      <button
        type="button"
        onClick={() => onRemoveModule(moduleId)}
        title="Delete module"
        aria-label="Delete module"
        className="cursor-pointer text-red-600"
      >
        <FaTrash />
      </button>
      <FaCheckCircle className="text-green-600" />
      <BsPlus className="text-3xl" />
      <IoEllipsisVertical className="text-xl" />
    </div>
  );
}
