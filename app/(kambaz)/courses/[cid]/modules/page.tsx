"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Module from "./Module";
import ModulesControls from "./ModulesControls";
import {
  useModulesStore,
  type CourseModule,
} from "../../../store/modulesStore";
import * as client from "../../client";

export default function Modules() {
  const { cid } = useParams();
  const courseId = typeof cid === "string" ? cid : "";
  return <CourseModules key={courseId} courseId={courseId} />;
}

function CourseModules({ courseId }: { courseId: string }) {
  const modules = useModulesStore((state) => state.modules);
  const setModules = useModulesStore((state) => state.setModules);
  const addModule = useModulesStore((state) => state.addModule);
  const deleteModule = useModulesStore((state) => state.deleteModule);
  const updateModule = useModulesStore((state) => state.updateModule);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState("");

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    let active = true;
    const load = async () => {
      try {
        const data = await client.findModulesForCourse(courseId);
        if (active) {
          setModules(data);
          setPending(false);
        }
      } catch {
        if (active) setError("Unable to load modules");
      }
    };
    void load();
    return () => {
      active = false;
      mounted.current = false;
    };
  }, [courseId, setModules]);

  const onAddModule = async (name: string) => {
    setError("");
    try {
      const created = await client.createModuleForCourse(courseId, { name });
      if (mounted.current) addModule(created);
      return true;
    } catch {
      setError("Unable to create module");
      return false;
    }
  };

  const onRemoveModule = async (moduleId: string) => {
    setError("");
    try {
      await client.deleteModule(moduleId);
      if (mounted.current) deleteModule(moduleId);
    } catch {
      setError("Unable to delete module");
    }
  };

  const onUpdateModule = async (module: Pick<CourseModule, "_id" | "name">) => {
    setError("");
    try {
      const saved = await client.updateModule(module);
      if (mounted.current) updateModule(saved);
    } catch {
      setError("Unable to update module");
    }
  };

  return (
    <div className="wd-modules">
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      {pending ? (
        !error && <p>Loading modules...</p>
      ) : (
        <>
          <ModulesControls onAddModule={onAddModule} />
          <ul id="wd-modules" className="m-0 list-none p-0">
            {modules.map((module) => (
              <Module
                key={module._id}
                module={module}
                onRemoveModule={onRemoveModule}
                onUpdateModule={onUpdateModule}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
