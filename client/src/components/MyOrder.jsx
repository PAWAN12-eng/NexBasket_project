import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosTostError from "../utils/AxiosTosterror";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await Axios(SummaryApi.getUserOrders);
      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (err) {
      AxiosTostError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">My Orders</h2>
        <div className="flex flex-col items-center justify-center h-40 text-gray-600">
          <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
          <p className="mt-2 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex gap-4 bg-white p-4 rounded-lg shadow border"
          >
            <div>
              <img
                src={order.product_detalis.image[0]}
                alt={order.product_detalis.name}
                className="w-24 h-24 object-cover rounded"
              />
            </div>

            <div>
              <p className="text-sm mb-1">
                <span className="font-medium">Item:</span>{" "}
                {order.product_detalis.name}
              </p>
              <p className="text-sm mb-1">
                <span className="font-medium">Quantity:</span> {order.qty}
              </p>
              <p className="text-sm mb-1">
                <span className="font-medium">Total:</span> ₹{order.totalAmt}
                {/* <span className="font-medium">Total:</span> ₹{order.subTotalAmt} */}
              </p>
              <p className="text-sm mb-1">
                <span className="font-medium">Status:</span>{" "}
                {order.status}
              </p>
              <p className="text-sm">
                <span className="font-medium">Ordered On:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrder;
