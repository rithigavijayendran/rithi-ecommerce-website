import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="mr-[5rem]">
      <div className="max-w-screen-lg mx-auto mt-6">
        <Link
          to="/"
          className="text-pink-600 text-xl font-medium hover:underline"
        >
          &larr; Go Back
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mt-8">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full rounded-lg shadow-lg"
                />
                <HeartIcon product={product} />
              </div>

              {/* Product Details */}
              <div>
                <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <p className="text-3xl font-bold text-pink-600 mb-6">
                ₹{product.price}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="flex items-center text-gray-700 mb-2">
                      <FaStore className="mr-2" /> Brand: {product.brand}
                    </p>
                    <p className="flex items-center text-gray-700 mb-2">
                      <FaClock className="mr-2" /> Added:{" "}
                      {moment(product.createdAt).fromNow()}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <FaStar className="mr-2" /> Reviews: {product.numReviews}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center text-gray-700 mb-2">
                      <FaStar className="mr-2" /> Ratings: {product.rating}
                    </p>
                    <p className="flex items-center text-gray-700 mb-2">
                      <FaShoppingCart className="mr-2" /> Quantity: {qty}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <FaBox className="mr-2" /> In Stock:{" "}
                      {product.countInStock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                  {product.countInStock > 0 && (
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="ml-[5rem] px-4 py-2 border rounded-lg"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-pink-700 disabled:opacity-50"
                >
                  Add To Cart
                </button>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="mt-8">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
