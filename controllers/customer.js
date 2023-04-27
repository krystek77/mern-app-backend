import Customer from "../models/customer.js";
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}, "-__v");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
