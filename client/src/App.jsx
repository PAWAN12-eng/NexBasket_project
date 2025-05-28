import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import fatchUserDetails from "./utils/fatchUserDetails";
import { setUserDetails } from "./Store/userSlice";
import { useDispatch } from "react-redux";
import {
  setAllCategory,
  setSubCategory,
  setLoadingCategory,
} from "./Store/productSlice";
import SummaryApi from "./common/SummaryApi";
import AxiosTostError from "./utils/AxiosTosterror";
import Axios from "./utils/Axios";
import { handleAddItemCart } from "./Store/CartProduct";
import GlobleProvider from "./provider/GlobleProvider";
import CartMobile from "./components/CartMobile";
import CursorTrail from "./components/CursorTrail";

function App() {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    const userData = await fatchUserDetails();
    dispatch(setUserDetails(userData.data));
  };

  const fetchCategories = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios(SummaryApi.getcetogry);
      dispatch(setAllCategory(response.data.data));
      // setCategories(response.data.data || []);
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoadingCategory(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await Axios(SummaryApi.getSubcategory);
      dispatch(setSubCategory(response.data.data));
      // setCategories(response.data.data || []);
    } catch (error) {
      AxiosTostError(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategories();
    fetchSubCategories();
    // fetchCartItme()
  }, []);

  return (
    <GlobleProvider>
      {/* <> */}
      <Header />
          <main className="min-h-[78vh]">
             <Outlet />
          </main>
      <Footer />
      <Toaster />
      {/* </> */}
      <div className=" sticky bottom-2 p-2 block md:hidden">
        <CartMobile />
      </div>
    </GlobleProvider>
  );
}

export default App;
