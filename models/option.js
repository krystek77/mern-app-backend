import mongoose from 'mongoose';
import URLSlug from "mongoose-slug-generator";
const options = {};
mongoose.plugin(URLSlug, options);

export const optionSchema = new mongoose.Schema({
  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Opcja musi należeć do kategorii'],
    },
  ],
  name: {
    type: String,
    validator: {
      validate: function (v) {
        return v !== '';
      },
      message: (props) => 'Opcja musi posiadać nazwę',
    },
  },
  slug: {
    type: String,
    slug: "name",
  },
});

optionSchema.pre('save', function (next) {
  this.slug = this.name.split(' ').join('-').toLowerCase();
  next();
});

const Option = mongoose.model('Option', optionSchema);
export default Option;
