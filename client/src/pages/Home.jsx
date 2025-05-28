import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { validURLConverter } from '../utils/valideURLConvert'
import banner from '../../public/banner1.jpeg'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProduct from '../components/CategoryWiseProduct'
import Header from '../components/Header'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const SubcategoryData = useSelector(state => state.product.subCategory)
  const navigate = useNavigate()

  const handelRedirectProductListpage = (id, cat) => {
    
    const subCategory = SubcategoryData.find(sub => {
      // Check if category object exists and compare its _id
      if (sub.category && sub.category._id == id) {
        return true;
      }
      return false;
    });
  
    if (subCategory) {
      const url = `/${validURLConverter(cat)}-${id}/${validURLConverter(subCategory.name)}-${subCategory._id}`;
      navigate(url)
    } else {
      console.warn("No matching subcategory found for category ID:", id);
    }
  };
  


  return (
    <section className='bg-white'>
      {/* <Header/> */}
      {/* header */}
      <div className='container mx-auto hidden lg:block py-3'>
        <div className={`w-full min-h-60 border bg-blue-100 rounded-xl hidden lg:block `}>
          <img src={banner}
            className='w-full h-60 hidden lg:block rounded-xl'
            alt='banner'
          />
        </div>
      </div>
      {/* category */}
      <div className="bg-white container mx-auto px-1 grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-0 md:gap-2">
        {
          loadingCategory ? (
            new Array(14).fill(null).map((_, index) => (
              <div key={index+"loadingCatergory"} className="bg-white rounded-lg p-4 h-40 flex flex-col justify-between items-center shadow animate-pulse">
                <div className="bg-blue-100 w-20 h-20 rounded"></div>
                <div className="bg-blue-100 w-3/4 h-4 rounded mt-2"></div>
              </div>
            ))
          ) : (
            categoryData.map((cat, index) => (
              <div className="p-1" key={index} onClick={() => handelRedirectProductListpage(cat._id, cat.name)}>
                <div className="flex flex-col items-center cursor-pointer justify-between text-center border rounded-lg md:px-2 md:pb-1 hover:shadow-md transition-all duration-300 h-28 md:h-40">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-16 h-16 md:w-24 md:h-24 object-contain md:mt-2"
                  />
                  <p className="text-xs md:text-sm w-full line-clamp-2 px-1 mb-2">{cat.name}</p>
                </div>
              </div>

            ))
          )
        }
      </div>

         {/* display category Products */}
         {
          categoryData.map((c,index)=>{
            return(
              <CategoryWiseProduct key={c?._id+"categroywiseProduct"}  id={c?._id} name={c?.name}/>
            )
          })
         }
    </section >
  )
}

export default Home
