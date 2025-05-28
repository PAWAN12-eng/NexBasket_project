import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ConfirmBox from "../components/ConfirmBox";

const CreatePickUpCenter = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    coordinates: {
      lat: "",
      lng: "",
    },
  });
  const [editId, setEditId] = useState(null);
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [showFormPopup, setShowFormPopup] = useState(false);

  const fetchWarehouses = async () => {
    try {
      const res = await Axios(SummaryApi.fetchWarehouses);
      if (res.data.success) {
        setWarehouses(res.data.data);
      } else {
        toast.error("Failed to fetch warehouses");
      }
    } catch (err) {
      toast.error("Error fetching warehouses");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiCall = editId
      ? Axios({ ...SummaryApi.editWarehouse(editId), data: formData })
      : Axios({ ...SummaryApi.createWarehouse, data: formData });

    try {
      const res = await apiCall;
      if (res.data.success) {
        toast.success(res.data.message || "Success");
        resetForm();
        fetchWarehouses();
      }
    } catch {
      toast.error("Error submitting warehouse data");
    }
  };

  const handleEdit = (warehouse) => {
    setFormData({
      name: warehouse.name || "",
      location: warehouse.location || "",
      coordinates: {
        lat: warehouse.coordinates?.lat || "",
        lng: warehouse.coordinates?.lng || "",
      },
    });
    setEditId(warehouse._id);
    setShowFormPopup(true);
  };

  const toggleStatus = async (id) => {
    try {
      const res = await Axios(SummaryApi.toggleWarehouseStatus(id));
      if (res.data.success) {
        toast.success(res.data.message);
        fetchWarehouses();
      }
    } catch {
      toast.error("Error toggling status");
    }
  };

  const deleteWarehouse = async () => {
    try {
      const res = await Axios(SummaryApi.deleteWarehouse(selectedDeleteId));
      if (res.data.success) {
        toast.success(res.data.message);
        fetchWarehouses();
        setOpenConfirmBoxDelete(false);
        setSelectedDeleteId(null);
      }
    } catch {
      toast.error("Error deleting warehouse");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      coordinates: { lat: "", lng: "" },
    });
    setEditId(null);
    setShowFormPopup(false);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="flex flex-col">
      {/* header part of  */}
      <div className="text-xl font-bold bg-white shadow-md p-2 flex items-center justify-between mb-4">
        <h1>Manage Pickup Centers</h1>
        <button
          onClick={() => {
            resetForm();
            setShowFormPopup(true);
          }}
          className="px-3 py-2 border border-primary-200 hover:bg-primary-200 text-black font-bold text-sm rounded transition"
        >
          Add Center
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w._id} className="text-sm">
                <td className="border px-4 py-2">{w.name}</td>
                <td className="border px-4 py-2">{w.location}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`font-semibold ${
                      w.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {w.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => toggleStatus(w._id)}
                    className={`px-3 py-1 rounded text-white ${
                      w.isActive ? "bg-gray-600" : "bg-green-600"
                    }`}
                  >
                    {w.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEdit(w)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDeleteId(w._id);
                      setOpenConfirmBoxDelete(true);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showFormPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editId ? "Edit Pickup Center" : "Add Pickup Center"}
            </h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  name="lat"
                  placeholder="Latitude"
                  value={formData.coordinates.lat}
                  onChange={handleChange}
                  className="w-1/2 border px-3 py-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="lng"
                  placeholder="Longitude"
                  value={formData.coordinates.lng}
                  onChange={handleChange}
                  className="w-1/2 border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Box */}
      {openConfirmBoxDelete && (
        <ConfirmBox
          title="Delete Confirmation"
          message="Are you sure you want to delete this pickup center?"
          confirm={deleteWarehouse}
          cancel={() => setOpenConfirmBoxDelete(false)}
          close={() => setOpenConfirmBoxDelete(false)}
        />
      )}
    </div>
  );
};

export default CreatePickUpCenter;
