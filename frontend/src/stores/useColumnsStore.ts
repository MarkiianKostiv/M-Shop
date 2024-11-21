import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { LocalStorageHelper } from "../helpers/localStorage.helper";
import { IColumn, ITask } from "../interfaces/column.interface";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core/dist/types";
import { arrayMove } from "@dnd-kit/sortable";

interface IColumnsStore {
  columns: IColumn[];
  tasks: ITask[];
  loading: boolean;
  activeColumn: IColumn | null;
  activeTask: ITask | null;
  isEdited: boolean;
  createNewColumn: () => void;
  deleteColumn: (id: UniqueIdentifier) => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  updateColumnHeader: ({
    id,
    title,
  }: {
    id: UniqueIdentifier;
    title: string;
  }) => void;
  createTask: (columnId: UniqueIdentifier) => void;
  deleteTask: (taskId: UniqueIdentifier) => void;
  editTask: (task: ITask) => void;
  saveDashboardData: () => void;
  onDragOver: (event: DragOverEvent) => void;
}

const local = new LocalStorageHelper();
const access_token = local.getItem("access_token");

export const useColumnsStore = create<IColumnsStore>((set, get) => ({
  columns: [],
  tasks: [],
  loading: false,
  setColumns: (columns: IColumn[]) => set({ columns }),
  activeColumn: null,
  activeTask: null,
  isEdited: false,

  createNewColumn: () => {
    const columns = get().columns;
    const columnToAdd: IColumn = {
      id: crypto.randomUUID(),
      title: `Column ${columns.length + 1}`,
    };

    set((state) => ({
      columns: [...state.columns, columnToAdd],
      isEdited: true,
    }));
  },

  deleteColumn: (id: UniqueIdentifier) => {
    const columns = get().columns;
    const tasks = get().tasks;
    const updatedColumns: IColumn[] = columns.filter((item) => item.id !== id);
    const updatedTasks: ITask[] = tasks.filter((task) => task.columnId !== id);

    set({ columns: updatedColumns, tasks: updatedTasks, isEdited: true });
  },

  onDragStart: (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      set({ activeColumn: event.active.data.current.column, isEdited: true });
      return;
    }

    if (event.active.data.current?.type === "Task") {
      set({ activeTask: event.active.data.current.task, isEdited: true });
      return;
    }
  },

  updateColumnHeader: ({
    id,
    title,
  }: {
    id: UniqueIdentifier;
    title: string;
  }) => {
    const columns = get().columns;
    const tasks = get().tasks;

    const editableColumn = columns.find((column) => column.id === id);

    if (editableColumn) {
      editableColumn.title = title;

      const updatedTasks = tasks.map((task) => {
        if (task.columnId === id) {
          task.status = title;
        }
        return task;
      });

      set({ columns: [...columns], isEdited: true });
      set({ tasks: [...updatedTasks], isEdited: true });
    }
  },

  onDragEnd: (event: DragEndEvent) => {
    set({ activeColumn: null, activeTask: null });
    const { active, over } = event;
    const activeColumId = active.id;
    const columns = get().columns;
    const overColumnId = over?.id;
    const tasks = [...get().tasks];

    if (!over) return;
    if (activeColumId === overColumnId) return;
    const activeIndex = columns.findIndex(
      (column) => column.id === activeColumId
    );
    const overIndex = columns.findIndex((column) => column.id === overColumnId);
    const updatedColumnsOrder = arrayMove(columns, activeIndex, overIndex);
    set({ columns: updatedColumnsOrder, isEdited: true });

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    const activeId = active.id;
    const overId = over?.id!;

    if (isActiveTask && isOverTask) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId);
      const overIndex = tasks.findIndex((task) => task.id === overId);
      tasks[activeIndex].columnId = tasks[overIndex].columnId;

      const updated = arrayMove(tasks, activeIndex, overIndex);

      set({ tasks: updated, isEdited: true });
    }
  },

  onDragOver: (event: DragOverEvent) => {
    const { active, over } = event;
    const activeId = active.id;
    const tasks = [...get().tasks];
    const columns = get().columns;
    const overId = over?.id!;

    if (!over) return;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    if (!isActiveTask) return;

    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId);
      const overColumn = columns.find((column) => column.id === overId);
      tasks[activeIndex].columnId = overId;
      tasks[activeIndex].status = overColumn?.title;

      const updated = arrayMove(tasks, activeIndex, activeIndex);

      set({ tasks: updated, isEdited: true });
    }
  },

  createTask: (columnId: UniqueIdentifier) => {
    const columns = get().columns;

    const currentColumn = columns.find((column) => column.id === columnId);
    const taskToAdd: ITask = {
      id: crypto.randomUUID(),
      columnId: columnId,
      description: "",
      title: "",
      status: currentColumn?.title,
    };

    set((state) => ({
      tasks: [...state.tasks, taskToAdd],
      isEdited: true,
    }));
  },

  deleteTask: (taskId: UniqueIdentifier) => {
    const tasks = get().tasks;
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    set({ tasks: updatedTasks, isEdited: true });
  },

  editTask: (taskProp: ITask) => {
    const tasks = get().tasks;
    const editableTask = tasks.find((task) => task.id === taskProp.id);

    if (editableTask) {
      editableTask.title = taskProp.title;
      editableTask.description = taskProp.description;

      set({ tasks: [...tasks], isEdited: true });
    }
  },

  saveDashboardData: async () => {
    const columns = get().columns;
    const tasks = get().tasks;

    const dashboardData = {
      columns,
      tasks,
    };

    console.log(dashboardData);

    try {
      set({ loading: true });

      // const res = await axiosInstance.put("/dashboard", dashboardData, {
      //   headers: { Authorization: `Bearer ${access_token}` },
      // });

      // set({ columns: res.data.columns, tasks: res.data.tasks, loading: false });

      setTimeout(() => {
        console.log("for test");

        set({ loading: false });
      }, 10000);
    } catch (err: unknown) {
      set({ loading: false });

      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "An error occurred");
      }
    }

    set({ isEdited: false });
  },
}));
