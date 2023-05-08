import mongoose from 'mongoose';
import URLString from 'mongoose-slug-generator';
mongoose.plugin(URLString);

const categorySchema = new mongoose.Schema(
  {
    icon: { type: String, default: "", },
    title: { type: String, required: [true, "Kategoria musi posiadać nazwę"], },
    image: { type: String, default: "", },
    features: [String],
    desc: { type: String, default: "", },
    position: { type: Number, default: 1, },
    slug: { type: String, slug: "title", },
    wide: { type: Boolean, default: false, },
    coin: { type: Boolean, default: false, },
    pageView: { type: Number, default: 0, },
    ips:{type:Array,default:[]}
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  this.slug = this.title.split(' ').join('-');
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
