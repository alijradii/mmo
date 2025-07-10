import mongoose, { Document, Schema } from "mongoose";

export interface IDiscordRoleQueue extends Document {
  discord_id: string;
  class: string;
  status: "pending" | "completed" | "failed";
  error?: string | null;
  created_at: Date;
  updated_at: Date;
}

const DiscordRoleQueueSchema = new Schema<IDiscordRoleQueue>({
  discord_id: { type: String, required: true },
  class: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  error: { type: String, default: null },
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});

DiscordRoleQueueSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const DiscordRoleQueue = mongoose.model<IDiscordRoleQueue>("DiscordRoleQueue", DiscordRoleQueueSchema);
