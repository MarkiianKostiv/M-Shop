import { Wrapper } from "../components/layout/Wrapper";
import { Plus, Save } from "lucide-react";
import { useColumnsStore } from "../stores/useColumnsStore";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useEffect, useMemo } from "react";
import { Column } from "../components/core/Column";
import { createPortal } from "react-dom";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Task } from "../components/core/Task";
import { EmptyState } from "../components/layout/EmptyState";
import { useParams } from "react-router-dom";

export const TaskPage = () => {
  const {
    columns,
    createNewColumn,
    onDragStart,
    onDragEnd,
    activeColumn,
    isEdited,
    saveDashboardData,
    onDragOver,
    loading,
    activeTask,
    getDashBoardById,
    activeDashBoardTitle,
  } = useColumnsStore();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getDashBoardById(id);
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 30,
      },
    })
  );

  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  return (
    <Wrapper>
      <div className='w-full flex flex-col items-center text-center px-6 overflow-auto'>
        <div>
          <h2 className='text-center text-3xl font-extrabold text-emerald-400'>
            {activeDashBoardTitle || "Task Page"}
          </h2>
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className='flex w-full flex-col gap-6 overflow-auto'>
            <div className='flex items-center justify-between'>
              <button
                className='bg-emerald-700 w-44 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
             transition duration-300 ease-in-out flex items-center justify-center'
                onClick={() => {
                  createNewColumn();
                }}
              >
                Add Column
                <Plus size={18} />
              </button>
              {isEdited && (
                <button
                  className='bg-emerald-700 w-24 hover:bg-emerald-600 text-white px-2 py-1 rounded-md font-medium
                transition duration-300 ease-in-out flex items-center justify-center'
                  onClick={saveDashboardData}
                >
                  {loading ? <LoadingSpinner /> : <Save size={18} />}
                </button>
              )}
            </div>

            <div className='flex items-center justify-start gap-12 overflow-auto'>
              {columns.length === 0 ? (
                <EmptyState
                  containerClassName={`w-full h-96 flex items-center justify-center flex-col bg-gray-500`}
                  headerText='You have tasks'
                  description='To add columns, please press Add column button'
                />
              ) : (
                <SortableContext items={columnsId}>
                  {columns.map((column) => (
                    <Column
                      key={column.id}
                      {...column}
                    />
                  ))}
                </SortableContext>
              )}
            </div>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && <Column {...activeColumn} />}
              {activeTask && <Task {...activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </Wrapper>
  );
};
