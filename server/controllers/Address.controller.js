import Address from "../models/address.model.js";

// GET all addresses of a user
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.userId;
    const addresses = await Address.find({ user: userId}).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch addresses", error });
  }
};

// create user address
export const createUserAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressLine, city, state, pincode, mobile, coordinates } = req.body;
    const address = new Address({
      user: userId,
      addressLine,
      city,
      state,
      pincode,
      mobile,
      coordinates,
    });
    await address.save();
    res.json({message: "Address added successfully", success: true});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || error });
  }
};

// ADD a new address
// export const addUserAddress = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { address_line, city, state, pincode, mobile } = req.body;

//     const newAddress = new AddressModel({
//       address_line,
//       city,
//       state,
//       pincode,
//       mobile,
//       user: userId,
//     });

//     await newAddress.save();
//     res.status(201).json({ success: true, message: "Address added successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to add address", error });
//   }
// };
