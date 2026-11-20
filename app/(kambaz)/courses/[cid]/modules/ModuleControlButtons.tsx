import { FaCheckCircle, FaPencilAlt, FaTrash } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { useModulesStore } from "../../../store/modulesStore";

export default function ModuleControlButtons({
  moduleId,
}: {
  moduleId: string;
}) {
  const deleteModule = useModulesStore((state) => state.deleteModule);
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
        onClick={() => deleteModule(moduleId)}
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
