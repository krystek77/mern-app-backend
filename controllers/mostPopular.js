export const increase = async(req,res) => {
    console.log('SERVER INCREASE',req.ip);
    console.log('',req.body)
    const {categoryName,isCoin} = req.body;
    const ip = req.ip;
    res.status(200).json({message:'SERVER INCREASE'})
}
export const getMost = async(req,res) => {
    console.log("SERVER GET MOST")
}