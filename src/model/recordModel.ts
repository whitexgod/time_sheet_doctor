import mongoose, { Document } from "mongoose";

export interface RecordModel extends Document {
  event: string;
  performer: string;
  startTime: string;
  endTime: string;
  timeElapsed: number;
  date: string;
}

const recordSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    performer: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timeElapsed: { type: Number, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const recordModel = mongoose.model<RecordModel>("records", recordSchema);
