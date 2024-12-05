import mongoose from "mongoose";

export interface IColumn {
  id: string;
  title: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  columnId: string;
}

export interface ITasksDashBoard extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  columns: IColumn[];
  tasks: ITask[];
}
