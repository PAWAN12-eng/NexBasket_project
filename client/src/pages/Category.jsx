import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import EditCategory from "../components/EditCategory";
import { data } from "react-router-dom";
import ConfirmBox from "../components/ConfirmBox";
import AxiosTostError from "../utils/AxiosTosterror";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Category = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
  const [deletCategory, setDeleteCategory] = useState({
    _id: ''
  })
  const AllCategory = useSelector((state) => state.product.allCategory);

  useEffect(()=>{
    setCategories(AllCategory)
  },[AllCategory])
  // const fetchCategory = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await Axios({
  //       ...SummaryApi.getcetogry,
  //     });
  //     setCategories(response.data?.data || []);
  //   } catch (error) {
  //     console.error("Failed to fetch categories:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchCategory();
  // }, []);


  const handleNewCategory = (newCategory) => {
    setCategories((prev) => [newCategory, ...prev]);
    setOpenUploadCategory(false);
  };

  const handleUpdateCategory = () => {
    setOpenEdit(false);
    fetchCategory();
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data:deletCategory
      });

      const {data:responseData}=response

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCategory();
        setOpenConfirmBoxDelete(false)
      }
    } catch (error) {
      AxiosTostError(error)
    }
  };



  return (
    <section className=" flex flex-col">
      {/* Header */}
      <div className="text-xl font-bold bg-white shadow-md p-2 flex items-center justify-between">
        <h2 className="font-semibold">Categories</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="px-3 py-2 border border-primary-200 hover:bg-primary-200 text-black font-bold text-sm rounded transition"
        >
          Add Category
        </button>
      </div>

      {/* Upload Modal */}
      {openUploadCategory && (
        <UploadCategoryModel
          close={() => setOpenUploadCategory(false)}
          onSuccess={handleNewCategory}
        />
      )}

      {/* Category List */}
      <div className="flex-1 px-4 mb-3 mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className="p-3 bg-white rounded-2xl text-center shadow-md hover:shadow-lg transition-transform hover:scale-105 flex flex-col justify-between h-50"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-24 h-24 object-cover mx-auto rounded border"
              />
              <p
                className="text-sm font-semibold text-gray-800 truncate mt-3 mb-3"
                title={category.name}
              >
                {category.name}
              </p>
              <div className="flex justify-between gap-2 text-xs">
                <button
                  onClick={() => {
                    setEditData(category);
                    setOpenEdit(true);
                  }}
                  className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button onClick={() => {
                  setOpenConfirmBoxDelete(true)
                  setDeleteCategory(category)
                }}

                  className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          onSuccess={handleUpdateCategory}
        />
      )}

      {
        openConfirmBoxDelete && (
          <ConfirmBox close={() => setOpenConfirmBoxDelete(false)} cancel={() => setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory} />
        )
      }
    </section>
  );
};

export default Category;
