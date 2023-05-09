import Category from '../models/category.js';
export const increase = async (req, res) => {
  const { categoryName, isCoin } = req.body;
  const ip = req.ip;
  try {
    const increase = await Category.findOneAndUpdate(
      { slug: categoryName, coin: isCoin, ips: { $ne: ip } },
      { $push: { ips: ip }, $inc: { pageView: 1 } },
      { new: true }
    );
    if (increase) return res .status(201) .json({ message: `Increase page views for \/${categoryName}\/ and coin: \/${isCoin}\/`, });
    return res .status(404) .json({ message: `You have already been on page: \/${categoryName}\/ and coin: \/${isCoin}\/`, });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const getMost = async (req, res) => {
  try {
    const result = await Category.find({},{image:1,title:1,pageView:1,slug:1},{sort:{pageView:-1},limit:4})
    res.status(200).json(result)
} catch (error) {
    res.status(409).json({ message: error.message });
  }
  
};
