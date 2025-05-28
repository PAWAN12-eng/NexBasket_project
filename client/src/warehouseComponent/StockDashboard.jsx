import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchStock } from '../redux/stockSlice';

export default function StockDashboard() {
//   const dispatch = useDispatch();
//   const { data } = useSelector((state) => state.stock);

//   useEffect(() => {
//     dispatch(fetchStock());
//   }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📦 Stock Dashboard</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Quantity</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {/* {data.map((item) => (
            <tr key={item._id} className="border-b text-sm text-center">
              <td>{item.product.name}</td>
              <td>{item.product.category}</td>
              <td>{item.product.subcategory}</td>
              <td>{item.quantity}</td>
              <td>{item.location.name}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
}
