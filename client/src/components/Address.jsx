import React, { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosTostError from "../utils/AxiosTosterror";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
    lat: "",
    lng: "",
  });

  const fetchAddresses = async () => {
    try {
      const res = await Axios(SummaryApi.getUserAddresses);
      if (res.data.success) {
        setAddresses(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load addresses");
    }
  };

  const handleAddAddress = async () => {
    try {
      const dataToSend = {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng)
      };
  
      const res = await Axios({
        ...SummaryApi.addUserAddress,
        data: {
          ...dataToSend,
          coordinates: {
            lat: dataToSend.lat,
            lng: dataToSend.lng,
          },
        },
      });
  
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAddresses();
        setIsAdding(false);
        setForm({
          addressLine: "",
          city: "",
          state: "",
          pincode: "",
          mobile: "",
          lat: "",
          lng: "",
        });
      }
    } catch (err) {
      AxiosTostError(err);
    }
  };
  

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-[79vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Addresses</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
        >
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-gray-600">No addresses found.</p>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white p-4 rounded shadow border"
            >
              <p>{address.address_line}</p>
              <p>
                {address.city}, {address.state}, {address.pincode}
              </p>
              <p>Mobile: {address.mobile}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
            <input
              placeholder="Address Line"
              onChange={(e) =>
                setForm({ ...form, addressLine: e.target.value })
              }
            />
            <input
              placeholder="City"
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              placeholder="State"
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
            <input
              placeholder="Pincode"
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />
            <input
              placeholder="Mobile"
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
            <input
              placeholder="Latitude"
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
            />
            <input
              placeholder="Longitude"
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
            />

            <div className="flex justify-end">
              <button
                onClick={handleAddAddress}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="text-gray-600 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 hover:text-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;
