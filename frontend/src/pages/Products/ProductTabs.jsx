import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 bg-gray-100 w-[90%]">
      {/* Tabs Menu */}
      <aside className="md:w-1/4">
        <nav className="space-y-4">
          <div
            className={`p-4 rounded-lg cursor-pointer transition ${
              activeTab === 1
                ? "bg-pink-600 text-white font-bold"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => handleTabClick(1)}
          >
            Write Your Review
          </div>
          <div
            className={`p-4 rounded-lg cursor-pointer transition ${
              activeTab === 2
                ? "bg-pink-600 text-white font-bold"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => handleTabClick(2)}
          >
            All Reviews
          </div>
          <div
            className={`p-4 rounded-lg cursor-pointer transition ${
              activeTab === 3
                ? "bg-pink-600 text-white font-bold"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => handleTabClick(3)}
          >
            Related Products
          </div>
        </nav>
      </aside>

      {/* Tabs Content */}
      <main className="md:w-3/4 mt-6 md:mt-0 md:ml-6 bg-white p-6 rounded-lg shadow-lg">
        {/* Write Your Review Tab */}
        {activeTab === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Write Your Review</h2>
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-6">
                {/* Rating Dropdown */}
                <div>
                  <label htmlFor="rating" className="block text-lg mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-3 w-full border rounded-lg focus:ring focus:ring-pink-300"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label htmlFor="comment" className="block text-lg mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-3 w-full border rounded-lg focus:ring focus:ring-pink-300"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
                >
                  {loadingProductReview ? "Submitting..." : "Submit"}
                </button>
              </form>
            ) : (
              <p className="text-lg">
                Please{" "}
                <Link to="/login" className="text-pink-600 hover:underline">
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
            {product.reviews.length === 0 ? (
              <p>No Reviews</p>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between mb-2">
                      <strong className="text-gray-800">{review.name}</strong>
                      <span className="text-gray-500">
                        {review.createdAt.substring(0, 10)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <Ratings value={review.rating} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related Products Tab */}
        <section>
        {activeTab === 3 && (
          <section className="ml-[3rem] flex flex-wrap">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              ))
            )}
          </section>
        )}
          </section>
      </main>
    </div>
  );
};

export default ProductTabs;
