import mongoose from 'mongoose';
import URLSlug from "mongoose-slug-generator";
const options = {};
mongoose.plugin(URLSlug, options);

export const heatingSchema = new mongoose.Schema({
  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Podgrzew musi musi należeć do kategorii'],
    },
  ],
  name: {
    type: String,
    validator: {
      validate: function (v) {
        return v !== '';
      },
      message: (props) => 'Podgrzew musi posiadać nazwę',
    },
  },
  slug: {
    type: String,
    slug: "name",
  },
});

heatingSchema.pre('save', function (next) {
  this.slug = this.name.split(' ').join('-').toLowerCase();
  next();
});

const Heating = mongoose.model('Heating', heatingSchema);
export default Heating;
