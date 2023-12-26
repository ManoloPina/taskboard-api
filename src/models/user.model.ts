import { Schema, Types, model } from "mongoose";

export interface IUser {
  id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = model<IUser>("USERS", userSchema);

export default User;
