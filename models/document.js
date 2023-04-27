import mongoose from 'mongoose';
import URLString from "mongoose-slug-generator";
mongoose.plugin(URLString);

export const documentSchema = new mongoose.Schema(
  {
    fieldname: { type: String, default: '' },
    originalname: { type: String, default: '' },
    encoding: { type: String, default: '' },
    mimetype: { type: String, default: '' },
    destination: { type: String, default: '' },
    filename: {
      type: String,
      default: '',
      // required: [true, 'File must have a name'],
    },
    path: { type: String, default: '' },
    size: { type: Number, default: 0 },
    slug: {
      type: String,
      slug: 'originalname',
    },
    displayFileName: { type: String, default: 'Karta Informacyjna' },
  },
  { timestamps: true }
);

documentSchema.pre("save", function (next) {
  this.slug = this.originalname.split(" ").join("-");
  next();
});
const Document = mongoose.model('Document', documentSchema);
export default Document;
