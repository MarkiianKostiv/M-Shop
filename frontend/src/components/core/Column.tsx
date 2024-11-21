import { Plus, Trash } from "lucide-react";
import { IColumn } from "../../interfaces/column.interface";
import { useColumnsStore } from "../../stores/useColumnsStore";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { Task } from "./Task";

export const Column = (column: IColumn) => {
  const { tasks, deleteColumn, updateColumnHeader, createTask } =
    useColumnsStore();
  const [title, setTitle] = useState(column.title);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const tasksForThisColumn = useMemo(() => {
    return tasks.filter((task) => task.columnId === column.id);
  }, [tasks, column.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBlur = () => {
    if (title !== column.title) {
      updateColumnHeader({ id: column.id, title });
    }
  };

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  if (isDragging) {
    return (
      <div className='flex flex-col w-[15rem] h-[500px] bg-gray-600 rounded-lg p-3 pt-5 cursor-pointer'></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: `translate3d(${transform?.x ?? 0}px, ${
          transform?.y ?? 0
        }px, 0)`,
        transition,
      }}
      {...attributes}
      {...listeners}
      className='flex flex-col min-w-52 h-[500px] bg-gray-800 rounded-lg p-3 pt-5 cursor-pointer'
    >
      <div className='flex items-center justify-between gap-3'>
        <input
          className='text-black'
          type='text'
          value={title}
          placeholder='title'
          onChange={handleTitleChange}
          onBlur={handleBlur}
        />

        <button
          className='text-red-400 hover:text-red-300'
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <Trash size={18} />
        </button>
      </div>
      <div className='overflow-auto flex flex-col  gap-3 mt-8 flex-1'>
        <SortableContext items={tasksIds}>
          {tasksForThisColumn.map((task) => (
            <Task
              key={task.id}
              {...task}
            />
          ))}
        </SortableContext>
      </div>
      <div className='sticky bottom-0'>
        <button
          className='bg-emerald-700 w-44 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
             transition duration-300 ease-in-out flex items-center justify-center'
          onClick={() => {
            createTask(column.id);
          }}
        >
          Add Task
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};
