import React, { useState } from "react";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import logo from "../../public/logo.png";
import logoicon from "../../public/logoicon.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logoutUser } from "../Store/userSlice";
import isAdmin from "../utils/isAdmin";

const HomePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => setShowPopup((prev) => !prev);

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.Logout });

      if (response.data.success) {
        dispatch(logoutUser());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong during logout.");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md flex items-center justify-between px-6 py-5 border-b fixed top-0 left-0 right-0 z-50">
        {/* logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logoicon}
            alt="logo icon"
            className="w-12 sm:w-12 md:w-12 lg:w-12  h-auto"
          />
          <img
            src={logo}
            alt="logo text"
            className="w-28 sm:w-32 md:w-40 lg:w-44 ml-[-1px] h-auto"
          />
        </Link>
        <div className="flex items-center gap-3 text-gray-700">
          <span className="flex">
            Hi, <p className="text-red-400"> (Admin)</p>
          </span>
          {/* <Link
            // onClick={handleClose}
            to={"/admin/profile"}
            className="hover:text-primary-200"
          >
            <FaEdit />
          </Link> */}
          <div
            className="w-10 h-10 flex items-center border hover:border-red-400 justify-center rounded-full overflow-hidden drop-shadow-lg cursor-pointer"
            onClick={togglePopup}
          >
            {user.avtar ? (
              <img
                src={user.avtar}
                alt={user.name}
                className="w-10 h-10 object-cover"
              />
            ) : (
              <FaUserCircle size={40} />
            )}
          </div>

          {/* Popup */}
          {showPopup && (
            <div className="absolute right-0 mt-64 bg-white border rounded-xl shadow-xl p-4 z-50 w-64 text-center transition-all duration-300 ease-in-out">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400 shadow-sm mb-3">
                {user.avtar ? (
                  <img
                    src={user.avtar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={64} className="text-blue-500" />
                )}
              </div>
          
              <p className="font-semibold text-gray-800 text-lg">{user.name}</p>
              <span className="text-xs text-gray-500 mb-4">
                {user.role === "ADMIN" && "(Admin)"}
              </span>
          
              <Link
              
                className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm px-4 py-2 rounded-full hover:from-blue-600 hover:to-indigo-600 transition"
                onClick={() => {
                  setShowPopup(false);
                  // navigate("/profile/edit"); or handle edit logic
                }}
                to={"/admin/profile"}
              >
                <FaEdit />Edit Profile
              </Link>
              <button
              onClick={handleLogout}
              className="text-left mt-2 text-red-600 font-medium hover:bg-red-100 px-2 py-1"
            >
              Log Out
            </button>
            </div>
          </div>
          
          )}
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-6 shadow-md overflow-y-auto pt-20 border-r">
          {/* <h2 className="text-xl font-semibold mb-4">Menu</h2> */}
          <div className="text-sm grid gap-1.5 mt-3">
            {isAdmin(user.role) && (
              <>
               <Link
                  to="/admin/Dashboard"
                  className="px-2 py-1 text-lg hover:bg-orange-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/category"
                  className="px-2 py-1 text-lg hover:bg-orange-100"
                >
                  Category
                </Link>
                <Link
                  to="/admin/sub-category"
                  className="px-2 py-1 text-lg hover:bg-orange-100"
                >
                  Sub Category
                </Link>
                <Link
                  to="/admin/upload-product"
                  className="px-2 py-1 text-lg hover:bg-orange-100"
                >
                  Upload Product
                </Link>
                <Link
                  to="/admin/product"
                  className="px-2 py-1 text-lg hover:bg-orange-100"
                >
                  Product
                </Link>
                <Link
                  to="/admin/create-pickup"
                  className="px-2 py-1 text-lg hover:bg-orange-100"
                >
                  Manage Warehouses
                </Link>
              </>
            )}
            
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
