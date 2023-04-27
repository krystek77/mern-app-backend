import mongoose from 'mongoose';
import URLslug from 'mongoose-slug-generator';
mongoose.plugin(URLslug);

export const sparePartSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    name: {
      type: String,
      default: '',
      validator: {
        validate: function (v) {
          return v !== '';
        },
        message: (props) => 'nazwa nie może być pustym ciagiem znaków',
      },
      required: true,
    },
    netPurchasePrice: {
      type: String,
      default: '0.0',
      validate: {
        validator: function (v) {
          return /^[0-9]*\.?[0-9]*$/gm.test(v);
        },
        message: (props) =>
          `${props.value} wpisany ciąg znaków nie jest poprawną ceną!`,
      },
    },
    netSalePrice: {
      type: String,
      default: '0.0',
      validate: {
        validator: function (v) {
          return /^[0-9]*\.?[0-9]*$/gm.test(v);
        },
        message: (props) =>
          `${props.value} wpisany ciąg znaków nie jest poprawną ceną!`,
      },
      required: [true, 'cena sprzedaży jest wymagana'],
    },
    countryOfOrigin: { type: String, default: 'Polska' },
    available: {
      type: String,
      enum: {
        values: ['TAK', 'NIE'],
        message: '{VALUE} - wartość nie dostępna',
      },
      default: 'NIE',
    },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    netWeight: {
      type: String,
      default: '0.0',
      validate: {
        validator: function (v) {
          return /(^[0]{1}\.[0-9]*$)|(^[0-9]+\.?[0-9]*$)/gm.test(v);
        },
        message: (props) =>
          `${props.value} wpisany ciąg znaków nie jest poprawną wagą!`,
      },
    },
    grossWeight: {
      type: String,
      default: '0.0',
      validate: {
        validator: function (v) {
          return /(^[0]{1}\.[0-9]*$)|(^[0-9]+\.?[0-9]*$)/gm.test(v);
        },
        message: (props) =>
          `${props.value} wpisany ciąg znaków nie jest poprawną wagą!`,
      },
    },
    comment: { type: String, default: '' },
    slug: { type: String, slug: 'name' },
    images:{
      type:Array,
      default:['data:image/png;base64,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']
    },
    stock: {
      type: Number,
      default: 0,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: (props) =>
          `wartość ${props.value} nie jest większa lub równa zero `,
      },
    },
  },
  { timestamps: true }
);

sparePartSchema.pre('save', function (next) {
  this.slug = this.name.split(' ').join('-');
  next();
});

const SparePart = mongoose.model('SparePart', sparePartSchema);
export default SparePart;
