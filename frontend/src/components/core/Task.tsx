import { Trash } from "lucide-react";
import { ITask } from "../../interfaces/column.interface";
import { useColumnsStore } from "../../stores/useColumnsStore";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";

export const Task = (task: ITask) => {
  const { deleteTask, editTask } = useColumnsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const handleSave = () => {
    editTask({
      ...task,
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  if (isDragging) {
    return (
      <div
        className={`relative flex flex-col bg-[rgb(92,98,98)] h-32
      rounded-lg p-3 group hover:shadow-lg transition-shadow duration-300
     `}
      ></div>
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
      className={`relative flex flex-col bg-[rgb(7,8,8)] 
                     rounded-lg p-3 group hover:shadow-lg transition-shadow duration-300
                     hover:border hover:border-red-200`}
    >
      {isEditing ? (
        <>
          <input
            type='text'
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder='Enter title'
            className='w-full mb-2 p-2 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder='Enter description'
            className='w-full mb-2 p-2 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            rows={3}
          />
          <div className='flex justify-end gap-2'>
            <button
              className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-400'
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              className='bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-400'
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <div className='flex items-start justify-center'>
            <div className='max-w-full flex-col flex items-start justify-start'>
              <h3 className='text-lg text-justify font-semibold break-words w-[170px]'>
                {task.title}
              </h3>
              <p className='text-sm text-justify justify-center text-gray-400 break-words w-[170px]'>
                {task.description}
              </p>
            </div>
            <button
              className='absolute top-2 right-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              onClick={() => deleteTask(task.id)}
            >
              <Trash size={18} />
            </button>
          </div>
          <button
            className='mt-2 text-blue-400 hover:text-blue-300'
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};
