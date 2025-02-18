import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import { Link } from "react-router-dom";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
            <div className="relative bg-gradient-to-r from-pink-600 to-indigo-400 text-white">
              <div className="container mx-auto p-8 text-center">
                <h1 className="text-5xl font-extrabold mb-4">Welcome to Rithi's Shop</h1>
                <p className="text-xl font-medium mb-8">
                Find It. Love It. Buy It!
                </p>
              </div>
            </div>
      <div className="mt-[2rem] ml-[4rem] flex justify-around">
        <div className="xl:block lg:hidden md:hidden:sm:hidden">
          <div className="grid grid-cols-2">
            {data.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
        <ProductCarousel />
      </div>
    </>
  );
};

export default Header;