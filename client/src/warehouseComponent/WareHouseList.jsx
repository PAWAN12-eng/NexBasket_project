import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { Warehouse } from "lucide-react";

const WarehouseListPage = () => {
  const [warehouses, setWarehouses] = useState([]);

  const fetchWarehouses = async () => {
    try {
      const res = await Axios(SummaryApi.fetchWarehouses);
      if (res.data.success) {
        setWarehouses(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch warehouses");
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Warehouse size={28} /> Pickup Centers
          </h1>
          <Link
            to="/"
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {warehouses.length === 0 ? (
          <p className="text-gray-500 text-center">No pickup centers found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {warehouses.map((w) => (
              <div
                key={w._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-all border border-gray-200"
              >
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    {w.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{w.location}</p>
                </div>
                <Link
                  to={`/warehouse/${w._id}/orders`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-all"
                >
                  View Orders
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseListPage;
