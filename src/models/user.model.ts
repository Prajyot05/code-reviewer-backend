import { Schema, Types, model } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  submissions: Types.Array<Types.ObjectId>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  submissions: [{ type: Schema.Types.ObjectId, ref: "Submission" }],
});

export const User = model<IUser>("User", userSchema);
