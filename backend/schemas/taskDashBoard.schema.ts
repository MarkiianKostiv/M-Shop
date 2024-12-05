import crypto from "crypto";
import mongoose, { Schema, model } from "mongoose";
import { ITasksDashBoard, IColumn, ITask } from "../models/tasks.model";

const ColumnSchema = new Schema<IColumn>({
  id: { type: String, required: true },
  title: { type: String, required: true },
});
const TaskSchema = new Schema<ITask>({
  id: { type: String, required: true },
  title: { type: String, required: false },
  description: { type: String, required: false },
  columnId: { type: String, required: true },
});

const schema = new Schema<ITasksDashBoard>(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    columns: {
      type: [ColumnSchema],
      default: [
        { title: "To do", id: crypto.randomUUID() },
        { title: "In progress", id: crypto.randomUUID() },
        { title: "Done", id: crypto.randomUUID() },
      ],
    },

    tasks: {
      type: [TaskSchema],
      default: [],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ITasksDashBoard>("Tasks_DashBoard", schema);
