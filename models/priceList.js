import mongoose from "mongoose";

export const priceListSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  discount: {
    type: String,
  },
  controls: [
    {
      name: String,
      slug: String,
      price: { type: String, default: "0" },
    },
  ],
  heatings: [
    {
      name: String,
      slug: String,
      price: { type: String, default: "0" },
    },
  ],
  voltages: [
    {
      name: String,
      slug: String,
      price: { type: String, default: "0" },
    },
  ],
  options: [
    {
      name: String,
      slug: String,
      price: { type: String, default: "0" },
    },
  ],
});

const PriceList = mongoose.model("PriceList", priceListSchema);
export default PriceList;
