import mongoose from 'mongoose';
import Product from './product.js';

export const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '-',
    },
  },
  { timestamps: true }
);

tagSchema.pre(
  'deleteOne',
  { document: false, query: true },
  async function (next) {
    const tagName = this.getFilter()['name'];
    console.log('delteOne on the model', tagName);
    await Product.updateMany(
      { 'tags.name': tagName },
      { $pull: { tags: { name: tagName } } },
      { multi: true }
    );
    next();
  }
);

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;
