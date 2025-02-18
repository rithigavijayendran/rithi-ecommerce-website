import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="ml-[13rem] max-w-screen-lg mx-auto mt-8">
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-4">
            Your cart is currently empty.
          </h2>
          <Link
            to="/shop"
            className="text-pink-500 font-medium hover:underline"
          >
            Go to Shop &rarr;
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-4 mb-4"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 ml-4">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-semibold text-pink-500 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 mt-1">{item.brand}</p>
                    <p className="text-xl font-bold mt-2">${item.price}</p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="w-28">
                    <select
                      className="w-full p-2 border rounded-lg text-black"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Button */}
                  <button
                    className=" ml-[2rem] text-red-500 hover:text-red-700"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg">Total Items:</p>
                <p className="text-lg font-semibold">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </p>
              </div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-lg">Total Price:</p>
                <p className="text-2xl font-bold">
                ₹{cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </p>
              </div>
              <button
                className="bg-pink-500 text-white py-3 px-6 rounded-lg w-full font-semibold hover:bg-pink-600 transition duration-200 disabled:opacity-50"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
