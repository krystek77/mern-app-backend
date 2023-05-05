import Watched from "../models/watched.js";
export const addLastWatched = async (req,res) => {
    const ip = req.ip ;
    const model="Pralma-16F".toUpperCase();//req.body.model
    const categorySlug = "pralnicowirowki-normalnoobrotowe";//req.body.categoryName

    try {
      const existingDoc = await Watched.findOne({ clientIP: ip });
      if (!existingDoc) {
        const doc = {clientIP:ip, models:[{model,categorySlug}]}
        const newDoc = new Watched(doc);
        await newDoc.save();
        return res.status(201).json({
          message: `New model from new IP: \/${ip}\/ added to last watched items successfully`,
        });
      }
      const result = await Watched.updateOne(
        {
          _id: existingDoc._id,
          'models.categorySlug': categorySlug,
          'models.model': { $ne: model },
        },
        {
          $push: {
            models: {
              $each: [{ model: model, categorySlug: categorySlug }],
              $slice: -6,
            },
          },
        }
      );
      if(result.acknowledged){
        return res.status(200).json({message:`Find \/${result.matchedCount}\/ item and modified \/${result.modifiedCount}\/ item for exist IP: \/${ip}\/`})
      }
      return res.status(404).json({message:"Not defined value of model"})
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
}
export const getLastWatched = async (req,res)=> {
  const ip = req.ip
  try {
    const result = await Watched.aggregate([
      {$match:{clientIP:ip}},
      {$project:{models:1,_id:0}},
      {$lookup: {
        from: "products",
        localField: "models.model",
        foreignField: "model",
        as: "last"
      }},
      // {$project:{"models.categorySlug":1,"last.model":1,"last.image":1,"last.coin":1,"last.title":1}},
    ])
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }

}