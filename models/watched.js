import mongoose from "mongoose";
const watchedSchema = new mongoose.Schema(
  {
    clientIP: { type: String, default: '::1' },
    models: [{ model: String, categorySlug: String }],
  },
  { timestamps: true }
);
const Watched = mongoose.model('Watched',watchedSchema);
export default Watched;