import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { Warehouse } from "lucide-react";

const OrderAcceptOrRejectByWareHouse = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await Axios(SummaryApi.getWarehouseById(id));
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await Axios.put(SummaryApi.updateOrderStatus(orderId), {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchOrders();
      } else {
        toast.error("Failed to update order");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const formatOrderDate = (dateString) => {
    const orderDate = new Date(dateString);
    const today = new Date();
    const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

    return isSameDay(orderDate, today)
      ? "Today"
      : orderDate.toLocaleString("en-IN");
  };

  useEffect(() => {
    fetchOrders();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-6 shadow-md">  */}
        {/* <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Warehouse size={28} /> Orders in Warehouse
          </h1>

        </div> */}
        <Link
          to="/warehosue-List"
          className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition border border-blue-100"
        >
          ← Back to List
        </Link>
      {/* </div> */}

      <div className="max-w-7xl mx-auto py-6">
        {loading ? (
          <div className="text-center py-12 text-lg font-semibold text-gray-600 animate-pulse">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-lg font-medium text-gray-500">
            No orders found for this warehouse.
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Qty / ₹Price</th>
                  <th className="px-4 py-3 text-left">Shipping Address</th>
                  <th className="px-4 py-3 text-left">Distance</th>
                  <th className="px-4 py-3 text-left">Ordered At</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{order.userId?.name}</p>
                      <p className="text-gray-500 text-xs">
                        {order.userId?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {order.productId?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {order.qty} / ₹{order.totalAmt}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <p>
                        {order.address?.address_line}, {order.address?.city},
                      </p>
                      <p>
                        {order.address?.state} - {order.address?.pincode}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {order.distanceFromWarehouseKm} km
                    </td>
                    <td className="px-4 py-3">
                      {formatOrderDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {order.status === "accepted" ? (
                        <span className="text-green-600 font-medium px-3 py-1 rounded-full bg-green-100">
                          Accepted
                        </span>
                      ) : order.status === "rejected" ? (
                        <span className="text-red-600 font-medium px-3 py-1 rounded-full bg-red-100">
                          Rejected
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleStatusChange(order._id, "accepted")
                            }
                            className="flex items-center bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition"
                          >
                            <FaCheck className="mr-1" /> Accept
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(order._id, "rejected")
                            }
                            className="flex items-center bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
                          >
                            <FaTimes className="mr-1" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderAcceptOrRejectByWareHouse;
