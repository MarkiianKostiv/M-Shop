import { UniqueIdentifier } from "@dnd-kit/core";

export interface IColumn {
  id: UniqueIdentifier;
  title: string;
}

export interface ITask {
  id: UniqueIdentifier;
  columnId: UniqueIdentifier;
  title: string;
  description: string;
  status?: string;
}

export interface DashBoard {
  title: string;
  _id: string;
  columns: IColumn[];
  tasks: ITask[];
}
