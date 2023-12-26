import { ObjectId, Schema, Types, model } from "mongoose";

export interface IBoard {
  _id: ObjectId;
  user_id: ObjectId;
  name: string;
  tasks: ITask[];
  columns: string[];
}

export interface ITask {
  _id: ObjectId;
  name: string;
  column: string;
  subtasks: ISubtask[];
  description?: string;
}

export interface ISubtask extends Document {
  _id: Types.ObjectId;
  name: string;
  status: boolean;
}

const subtaskSchema = new Schema<ISubtask>({
  _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
  name: { type: String, required: true },
  status: { type: Boolean, required: true },
});

const taskSchema = new Schema<ITask>({
  _id: { type: Types.ObjectId, auto: true },
  name: { type: String, required: true },
  column: { type: String, required: true },
  subtasks: [subtaskSchema],
  description: { type: String },
});

const boardSchema = new Schema<IBoard>({
  _id: { type: Types.ObjectId, auto: true },
  user_id: { type: Types.ObjectId, auto: false },
  name: { type: String, required: true },
  columns: [{ type: String, required: true }],
  tasks: [taskSchema],
});

const Board = model<IBoard>("BOARDS", boardSchema);

export default Board;
