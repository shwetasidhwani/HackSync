import mongoose from "mongoose";

const ShortsWatchTimeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  totalTime: { type: Number, required: true, default: 0 }, // Time in milliseconds
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("ShortsWatchTime", ShortsWatchTimeSchema);
