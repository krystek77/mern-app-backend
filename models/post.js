import mongoose from 'mongoose';
import URLString from "mongoose-slug-generator";
mongoose.plugin(URLString);

export const postSchema = new mongoose.Schema(
  {
    fieldname: { type: String, default: '' },
    originalname: { type: String, default: '' },
    encoding: { type: String, default: '' },
    mimetype: { type: String, default: '' },
    destination: { type: String, default: '' },
    filename: {
      type: String,
      default: '',
    },
    path: { type: String, default: '' },
    size: { type: Number, default: 0 },
    slug: {
      type: String,
      slug: 'originalname',
    },
  },
  { timestamps: true }
);

postSchema.pre("save", function (next) {
  this.slug = this.originalname.split(" ").join("-");
  next();
});
const Post = mongoose.model('Post', postSchema);
export default Post;
