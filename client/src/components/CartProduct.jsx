import React from 'react'
import { IndianRupee } from "lucide-react";
import { Link } from 'react-router-dom';
import { validURLConverter } from '../utils/valideURLConvert';
import PriceWithDiscount from '../utils/PriceWithDiscount';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTosterror';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGlobleContext } from '../provider/GlobleProvider';
import AddToCartButton from './AddToCartButton';

const CartProduct = ({ data }) => {
    const url = `/product/${validURLConverter(data.name)}-${data._id}`
    const [loading, setLoading] = useState(false)
    // const {fetchCartItems,handleUpdateQty}=useGlobleContext()


    // const handelAddToCart = async(e)=>{
    //     e.preventDefault()
    //     e.stopPropagation()
    //     try {
    //        setLoading(true)
    //         const response = await Axios({
    //             ...SummaryApi.AddToCart,
    //             data:{
    //                 productId:data?._id
    //             }
    //         })
    //         const {data:responseData}=response
    //         if(responseData.success){
    //             toast.success(responseData.message)
    //             if(fetchCartItems){
    //                 fetchCartItems()
    //             }

    //         }
    //     } catch (error) {
    //         AxiosTostError(error)
    //     }finally{
    //         setLoading(false)
    //     }
    // }




    return (
        <Link to={url} className='relative border lg:p-4 p-2 grid gap-1 lg:gap-3 lg:max-w-52 max-w-40 lg:min-w-52 min-w-40 rounded bg-white'>

            {data.discount > 0 && (

<div className="absolute top-0 left-0 p-2">
<span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow">
  {data.discount}% OFF
</span>
</div>



            )}

<div className="min-h-20 max-h-20 lg:min-h-32 lg:max-h-32 rounded">
    <img
      src={data.image[0]}
      alt=""
      className="w-full h-full object-scale-down lg:scale-110"
    />
  </div>
            <div className='px-2 p-[1px] text-green-600 text-sm rounded bg-green-100 w-fit'>
                10 min
            </div>
            <div className='font-medium line-clamp-2 text-ellipsis lg:min-h-12 min-h-12'>
                {data.name}
            </div>
            <div className='w-fit'>
                {data.unit}
            </div>


            <div className='flex items-center justify-between gap-2 h-10 '>
                <div className="w-fit font-semibold text-center">
                    <span className='flex items-center'>
                        <IndianRupee size={12} className="text-black mt-0.5" />{PriceWithDiscount(data.price, data.discount)}</span>
                    {
                        data.discount > 0 && (
                            <p className='line-through text-sm text-gray-600'> ₹{data.price} </p>
                        )
                    }

                </div>

                <div >
                    {
                        data.stock == 0 ? (
                            <p className='text-red-500 text-sm text-center font-semibold'>Out of stock</p>
                        ) : (
                            <AddToCartButton data={data} />
                        )
                    }

                </div>
            </div>
        </Link>
    )
}

export default CartProduct
