import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useGlobleContext } from '../provider/GlobleProvider';
import { clearCart } from '../Store/CartProduct'
import AxiosTostError from '../utils/AxiosTosterror'

const CheckOutPage = () => {
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    mobile: '',
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const totalPrice = useSelector((s) => s.cartItem.totalPrice)
  // const totalQty   = useSelector((s) => s.cartItem.totalQty)
  const { totalPrice, totalQty } = useGlobleContext()
  const cartItems = useSelector(s => s.cartItem.cart);

  const getDeliveryCharges = () => {
    if (totalPrice < 200) return 50;
    if (totalPrice >= 200 && totalPrice <= 500) return 30;
    return 0;
  };

  const deliveryCharges = getDeliveryCharges();
  const grandTotal = totalPrice + deliveryCharges;


  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await Axios(SummaryApi.getUserAddresses)
        if (res.data.success) setAddresses(res.data.data)
      } catch {
        toast.error('Failed to fetch addresses')
      }
    }
    fetchAddresses()
  }, [])

  // Add a new address
  const handleAddAddress = async () => {
    const { address_line, city, state, pincode, mobile } = form
    if (!address_line || !city || !state || !pincode || !mobile) {
      return toast.error('Please fill all fields')
    }
    try {
      const res = await Axios({
        ...SummaryApi.addUserAddress,
        data: form,
      })
      if (res.data.success) {
        toast.success('Address added')
        setForm({ address_line: '', city: '', state: '', pincode: '', mobile: '' })
        setIsAdding(false)
        // Re-fetch
        const r2 = await Axios(SummaryApi.getUserAddresses)
        if (r2.data.success) setAddresses(r2.data.data)
      }
    } catch {
      toast.error('Failed to add address')
    }
  }

  // Cash on Delivery
  const handleCOD = async () => {
    if (!selectedAddress) return toast.error('Select an address')
    try {
      const res = await Axios({
        ...SummaryApi.CashOnDelivery,
        data: {
          list_items: cartItems,
          addressId: selectedAddress,
          totalAmount: grandTotal,
          subTotalAmt: grandTotal,
        },
      })
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(clearCart())
        navigate('/order-confirmation')
      } else {
        toast.error(res.data.message || 'COD failed')
      }
    } catch(err) {
      AxiosTostError(err)
    }
  }


  const handleStripe = async () => {
    toast.success('coming soon');
    // if (!selectedAddress) return toast.error('Select an address');
    // try {
    //   const invalidItem = cartItems.find(item => isNaN(item.totalPrice) || isNaN(item.qty));
    //   if (invalidItem) {
    //     return toast.error('Invalid item data: Ensure price and quantity are valid numbers');
    //   }
  
    //   const { data } = await Axios({
    //     ...SummaryApi.stripeSession,
    //     data: { cartItems, totalAmount: totalPrice, addressId: selectedAddress },
    //   });
  
    //   if (data.success && data.url) {
    //     // Redirect to Stripe Checkout
    //     window.location.href = data.url;
    //   } else {
    //     throw new Error(data.message || 'Session creation failed');
    //   }
    // } catch (err) {
    //   console.error('Stripe error:', err);
    //   toast.error('Error creating payment session');
    // }
  };
  


  return (
    <div className="p-4 lg:flex gap-4 bg-blue-50 min-h-screen">
      {/* LEFT: Addresses */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-lg font-semibold mb-2">Choose your address</h2>
        <div className="space-y-2">
          {addresses.map((addr) => (
            <label
              key={addr._id}
              className={`block p-4 rounded-lg border cursor-pointer ${
                selectedAddress === addr._id ? 'bg-blue-100' : 'bg-white'
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={selectedAddress === addr._id}
                onChange={() => setSelectedAddress(addr._id)}
              />
              <div className="ml-2">
                <p>{addr.address_line}</p>
                <p>{addr.city}, {addr.state}</p>
                <p>India – {addr.pincode}</p>
                <p>{addr.mobile}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Add Address Modal */}
        {isAdding ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
              {['address_line','city','state','pincode','mobile'].map((f) => (
                <input
                  key={f}
                  placeholder={f.replace('_',' ')}
                  value={form[f]}
                  onChange={e => setForm(s => ({ ...s, [f]: e.target.value }))}
                  className="block w-full mb-2 border p-2 rounded"
                />
              ))}
              <div className="flex justify-end">
                <button onClick={handleAddAddress}
                  className="bg-green-600 text-white px-4 py-2 rounded mr-2">
                  Save
                </button>
                <button onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded border">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 w-full p-3 bg-white border rounded-lg text-blue-600"
          >
            Add address
          </button>
        )}
      </div>

      {/* RIGHT: Summary & Payments */}
      <div className="w-full lg:w-1/3 p-4 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <div className="space-y-1 text-sm mb-4">
          <div className="flex justify-between">
            <span>Items total</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity total</span>
            <span>{totalQty} items</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <p className="text-sm text-gray-600">
                  {deliveryCharges === 0 && "Free"}
                  {deliveryCharges === 50 && "₹50"}
                  {deliveryCharges === 30 && (
                    <span>
                      <span className="line-through mr-1 text-gray-400">
                        ₹50
                      </span>
                      <span className="text-green-600 font-medium">₹30</span>
                    </span>
                  )}
                </p>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Grand total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        <button onClick={handleStripe}
                className="w-full bg-indigo-600 text-white py-2 rounded mb-2">
          Pay with Card
        </button>
       
        <button
          onClick={handleCOD}
          className="w-full border border-green-600 text-green-600 py-2 rounded"
        >
          Cash on Delivery
        </button>
      </div>
    </div>
  )
}

export default CheckOutPage
