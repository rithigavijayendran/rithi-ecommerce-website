import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
    style={{ zIndex: 9999 }}
    className={`${
      showSidebar ? "hidden" : "flex"
    } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[4%] hover:w-[10%] h-[100vh]  fixed `}
    id="navigation-container">
  <div className="flex flex-col justify-center space-y-4">
    <Link
      to="/"
      className="flex items-center transition-transform transform hover:translate-x-2"
    >
      <AiOutlineHome className="mr-2 mt-[2rem]" size={26} />
      <span className="nav-item-name mt-[2rem]">HOME</span>
    </Link>

    <Link
      to="/shop"
      className="flex items-center transition-transform transform hover:translate-x-2"
    >
      <AiOutlineShopping className="mr-2 mt-[2rem]" size={26} />
      <span className="nav-item-name mt-[2rem]">SHOP</span>
    </Link>

    <Link to="/cart" className="flex relative">
      <div className="flex items-center transition-transform transform hover:translate-x-2">
        <AiOutlineShoppingCart className="mt-[2rem] mr-2" size={26} />
        <span className="nav-item-name mt-[2rem]">Cart</span>
      </div>
      {cartItems.length > 0 && (
        <span className="absolute top-9 px-2 py-0 text-sm text-white bg-pink-500 rounded-full">
          {cartItems.reduce((a, c) => a + c.qty, 0)}
        </span>
      )}
    </Link>

    <Link to="/favorite" className="flex relative">
      <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
        <FaHeart className="mt-[2rem] mr-2" size={20} />
        <span className="nav-item-name mt-[2rem]">Favorites</span>
        <FavoritesCount />
      </div>
    </Link>
  </div>

  <div className="relative mt-auto">
    <button
      onClick={toggleDropdown}
      className="flex items-center justify-between w-full px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-800 transition"
    >
       {userInfo && (
    <div className="flex items-center space-x-2">
      <AiOutlineUser className="text-white" size={20} />
      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[8rem]">
        {userInfo.username}
      </span>
    </div>
  )}
      {userInfo && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ml-1 transition-transform ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      )}
    </button>

    {dropdownOpen && userInfo && (
       <ul
       className={`absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-800 ${
         !userInfo.isAdmin ? "-top-30" : "-top-80"
       } `}
     >
        {userInfo.isAdmin && (
          <>
            <li>
              <Link
                to="/admin/dashboard"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/productlist"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/categorylist"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Category
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orderlist"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/userlist"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Users
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
            Profile
          </Link>
        </li>
        <li>
          <button
            onClick={logoutHandler}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Logout
          </button>
        </li>
      </ul>
    )}

    {!userInfo && (
      <ul className="mt-4">
        <li>
          <Link
            to="/login"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineLogin className="mr-2" size={26} />
            <span className="nav-item-name">LOGIN</span>
          </Link>
        </li>
        <li>
          <Link
            to="/register"
            className="flex items-center mt-3 transition-transform transform hover:translate-x-2"
          >
            <AiOutlineUserAdd size={26} />
            <span className="nav-item-name">REGISTER</span>
          </Link>
        </li>
      </ul>
    )}
  </div>
</div>
  );
};

export default Navigation;