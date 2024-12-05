import { Request, Response } from "express";
import taskDashBoardSchema from "../schemas/taskDashBoard.schema";
import { getUserByToken } from "../utils/getUserByToken";

export const createDashboard = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization!;
    const user = await getUserByToken(accessToken);

    const { title } = req.body;
    const dashBoard = await taskDashBoardSchema.create({
      user: user?._id,
      title,
    });
    res
      .status(201)
      .json({ dashBoard, message: "Dashboard created successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllDashBoardsByUserId = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization!;
    const user = await getUserByToken(accessToken);
    if (user) {
      const dashBoards = await taskDashBoardSchema.find({
        user: user.id,
      });
      res.status(200).json({ dashBoards });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getDashBoardById = async (req: Request, res: Response) => {
  try {
    const dashBoardId = req.params.id;
    const dashBoard = await taskDashBoardSchema.findById({ _id: dashBoardId });
    if (!dashBoard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }
    res.status(200).json({ dashBoard });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDashBoardById = async (req: Request, res: Response) => {
  try {
    const dashBoardId = req.params.id;
    const { title, columns, tasks } = req.body;
    const dashBoard = await taskDashBoardSchema.findById({ _id: dashBoardId });

    if (dashBoard) {
      dashBoard.title = title;
      dashBoard.columns = columns;
      dashBoard.tasks = tasks;

      const updatedDashBoard = await dashBoard.save();

      res.status(201).json({
        dashBoard: updatedDashBoard,
        message: "Dashboard updated successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDashBoard = async (req: Request, res: Response) => {
  try {
    const dashBoardId = req.params.id;
    await taskDashBoardSchema.findByIdAndDelete({
      _id: dashBoardId,
    });
    res.status(201).json({ message: "Dash Board deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
