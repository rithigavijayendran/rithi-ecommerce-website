import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-8 px-4">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="ml-[5rem] grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Image</th>
                      <th className="px-4 py-2">Product</th>
                      <th className="px-4 py-2">Quantity</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.cartItems.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </td>
                        <td className="p-2">
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </td>
                        <td className="p-2">{item.qty}</td>
                        <td className="p-2">₹{item.price.toFixed(2)}</td>
                        <td className="p-2">₹{(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <ul className="mb-6">
                <li className="flex justify-between py-2 border-b">
                <span className="font-semibold mb-4">Items:</span> ₹ 
                {Number(cart.itemsPrice || 0).toFixed(2)}
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span className="font-semibold mb-4">Shipping:</span> ₹ 
                  {Number(cart.shippingPrice || 0).toFixed(2)}
                </li>
                <li className="flex justify-between py-2 border-b">
                <span className="font-semibold mb-4">Tax:</span> ₹ 
                {Number(cart.taxPrice || 0).toFixed(2)}
 
                </li>
                <li className="flex justify-between py-2 border-b">
                <span className="font-semibold mb-4">Total:</span> ₹ 
                {Number(cart.totalPrice || 0).toFixed(2)}
                </li>
              </ul>

              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">Shipping Address</h2>
                <p>{cart.shippingAddress.address}</p>
                <p>
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                  {" "}
                  {cart.shippingAddress.country}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">Payment Method</h2>
                <p>{cart.paymentMethod}</p>
              </div>

              {error && (
                <Message variant="danger" className="mb-4">
                  {error.data.message}
                </Message>
              )}

              <button
                type="button"
                className="bg-pink-500 text-white py-3 px-6 rounded-lg w-full text-lg font-semibold hover:bg-pink-600 transition-all"
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </button>

              {isLoading && <Loader />}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;
