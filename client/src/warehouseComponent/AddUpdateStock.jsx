import { useState } from 'react';
import axios from 'axios';

export default function AddUpdateStock() {
  const [form, setForm] = useState({
    productId: '',
    quantity: '',
    locationId: '',
    action: 'INCREASE',
    remarks: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/stocks/update', form);
      alert('Stock updated!');
    } catch (err) {
      alert('Error updating stock');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">➕ Add / Update Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input name="productId" onChange={handleChange} placeholder="Product ID" className="w-full border p-2" />
        <input name="quantity" type="number" onChange={handleChange} placeholder="Quantity" className="w-full border p-2" />
        <input name="locationId" onChange={handleChange} placeholder="Location ID" className="w-full border p-2" />
        <select name="action" onChange={handleChange} className="w-full border p-2">
          <option value="INCREASE">Increase</option>
          <option value="DECREASE">Decrease</option>
        </select>
        <input name="remarks" onChange={handleChange} placeholder="Remarks (optional)" className="w-full border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
