import mongoose from 'mongoose';
import URLSlug from 'mongoose-slug-generator';
const options = {};
mongoose.plugin(URLSlug, options);

export const additionalEquipmentSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      unique: true,
      required: [true, 'Sprzęt dodatkowy musi posiadać oznaczenie'],
    },
    name: {
      type: String,
      validator: {
        validate: function (v) {
          return v !== '';
        },
        message: (props) => `Sprzęt dodatkowy musi posiadać nazwę`,
      },
    },
    description: { type: String, default: '' },
    images: [{ type: String }],
    slug: { type: String, slug: 'model' },
    technicalData: [{ type: String }],
    price: { type: String, default: '0.1' },
    featuredFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true }
);

const AdditionalEquipment = mongoose.model(
  'AdditionalEquipment',
  additionalEquipmentSchema
);
additionalEquipmentSchema.pre('save', function (next) {
  this.slug = this.model.split(' ').join('-').tolowerCase();
  next();
});
export default AdditionalEquipment;
