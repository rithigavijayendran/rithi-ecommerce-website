import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Redirect to shipping if no address is saved
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="max-w-screen-md mx-auto mt-10">
      {/* Progress Steps */}
      <ProgressSteps step1 step2 />

      <div className="bg-gray-100 p-8 rounded-lg shadow-lg mt-10">
        <form onSubmit={submitHandler}>
          <h1 className="text-3xl font-bold mb-6">Shipping Information</h1>

          {/* Address Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* City Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">City</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Postal Code Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Postal Code
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          {/* Country Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Country
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Payment Method
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-pink-500 focus:ring-pink-500"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="text-gray-700">PayPal or Credit Card</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-pink-500 focus:ring-pink-500"
                  name="paymentMethod"
                  value="Stripe"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="text-gray-700">Stripe</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-pink-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300 transition duration-200"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
