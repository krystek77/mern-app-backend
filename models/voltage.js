import mongoose from 'mongoose';
import URLSlug from 'mongoose-slug-generator';
const options = {};
mongoose.plugin(URLSlug, options);

export const voltageSchema = new mongoose.Schema({
  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Zasilanie musi należeć do kategorii'],
    },
  ],
  name: {
    type: String,
    validator: {
      validate: function (v) {
        return v !== '';
      },
      message: (props) => 'Zasilanie musi posiadać nazwę',
    },
  },
  slug: {
    type: String,
    slug: 'name',
  },
});

voltageSchema.pre('save', function (next) {
  this.slug = this.name.split(' ').join('-').toLowerCase();
  next();
});

const Voltage = mongoose.model('Voltage', voltageSchema);
export default Voltage;
