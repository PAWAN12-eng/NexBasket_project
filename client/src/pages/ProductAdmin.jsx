import React, { useEffect, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTosterror';

const itemsPerPage = 12;

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);


  const fetchProducts = async () => {
    try {
      const response = await Axios(SummaryApi.getProduct);
      if (response.data.success) {
        setProducts(response.data.products || []);
        setFilteredProducts(response.data.products || []);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      setDeletingId(productId);
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        url: `${SummaryApi.deleteProduct.url}/${productId}`,
      });
  
      if (response.data.success) {
        toast.success(response.data.message);
        const updatedList = products.filter(p => p._id !== productId);
        setProducts(updatedList);
        setFilteredProducts(updatedList);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setDeletingId(null);
    }
  };
  

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Product Management</h1>
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-full max-w-md bg-white shadow-sm">
          <CiSearch size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="ml-3 w-full bg-transparent outline-none text-sm"
          />
        </div>
       
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-300 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm mt-2 text-gray-500">Loading products...</p>
          </div>
        </div>
      ) : currentItems.length === 0 ? (
        // No products state
        <div className="flex justify-center items-center h-80">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {currentItems.map((product) => (
              <div
                key={product._id}
                className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md border transition w-full max-w-[170px] h-[200px]"
                >
                <img
                  src={product.image?.[0] || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-24 h-24 object-contain mb-1 rounded"
                />
                <h3 className="text-sm font-semibold text-center line-clamp-1">{product.name}</h3>
                {/* <p className="text-xs text-gray-500 mb-1">{product.category?.name || 'Unknown Category'}</p> */}
                <p className="text-green-600 font-semibold text-sm">₹{product.price}</p>
                {/* <p className="text-xs text-gray-500 mb-1">Stock: {product.stock}</p> */}
                <p className="text-xs mb-2">
                  {product.publish ? (
                    <span className="text-green-600 font-semibold">Published</span>
                  ) : (
                    <span className="text-gray-400">Draft</span>
                  )}
                </p>
                <div className="flex gap-3 mt-auto">
                  <Link to={`/admin/edit-product/${product._id}`} title="Edit">
                    <MdEdit size={20} className="text-blue-500 hover:text-blue-700" />
                  </Link>
                  <button onClick={() => handleDelete(product._id)} title="Delete">
                    <MdDelete size={20} className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center gap-6">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}
            </span>
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage >= Math.ceil(filteredProducts.length / itemsPerPage)}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage))
                )
              }
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductAdmin;
