import React, { useEffect, useState } from 'react';
import {
  FaBox,
  FaTags,
  FaClipboardList,
  FaWarehouse,
  FaBoxes,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTosterror';

const AdminDashboardPage = () => {
  const [counts, setCounts] = useState({
    orders: 0,
    acceptedOrders: 0,
    rejectedOrders: 0,
    pendingOrders: 0,
    categories: 0,
    subcategories: 0,
    products: 0,
    warehouses: 0,
  });

  const fetchCounts = async () => {
    try {
      const response = await Axios(SummaryApi.AdminDashboardCounts);
      const { success, data } = response.data;
      if (success) {
        setCounts(data);
      }
    } catch (err) {
      AxiosTostError(err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const cards = [
    {
      label: 'Total Orders',
      icon: <FaClipboardList className="text-blue-500 text-3xl" />,
      value: counts.orders,
    },
    {
      label: 'Accepted Orders',
      icon: <FaCheckCircle className="text-green-600 text-3xl" />,
      value: counts.acceptedOrders,
    },
    {
      label: 'Rejected Orders',
      icon: <FaTimesCircle className="text-red-500 text-3xl" />,
      value: counts.rejectedOrders,
    },
    {
      label: 'Pending Orders',
      icon: <FaClock className="text-yellow-500 text-3xl" />,
      value: counts.pendingOrders,
    },
    {
      label: 'Categories',
      icon: <FaTags className="text-indigo-500 text-3xl" />,
      value: counts.categories,
    },
    {
      label: 'Subcategories',
      icon: <FaBoxes className="text-orange-500 text-3xl" />,
      value: counts.subcategories,
    },
    {
      label: 'Products',
      icon: <FaBox className="text-purple-500 text-3xl" />,
      value: counts.products,
    },
    {
      label: 'Warehouses',
      icon: <FaWarehouse className="text-teal-500 text-3xl" />,
      value: counts.warehouses,
    },
  ];

  return (
    <section className="p-6 min-h-[88vh] bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex items-center space-x-4 transition duration-200"
          >
            {card.icon}
            <div>
              <p className="text-gray-600 text-sm font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboardPage;
