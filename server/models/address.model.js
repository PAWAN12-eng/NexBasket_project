import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  addressLine: String,
  city: String,
  state: String,
  pincode: String,
  mobile: String,
  coordinates: {
    lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  }
});
const Address= mongoose.model("Address",addressSchema)

export default Address
