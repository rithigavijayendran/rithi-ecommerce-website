import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter((product) => {
          return (
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="bg-pink-800 ml-[3rem] text-white p-6 rounded-lg shadow-lg md:w-1/5 mb-[100rem]">
            <h2 className="text-xl font-bold text-center mb-4">Filters</h2>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              <div>
                {categories?.map((c) => (
                  <div key={c._id} className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id={c._id}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-pink-600 focus:ring-pink-500 rounded"
                    />
                    <label
                      htmlFor={c._id}
                      className="ml-2 text-sm font-medium"
                    >
                      {c.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Brands</h3>
              <div>
                {uniqueBrands?.map((brand) => (
                  <div key={brand} className="flex items-center mb-3">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-pink-600 focus:ring-pink-500 rounded"
                    />
                    <label
                      htmlFor={brand}
                      className="ml-2 text-sm font-medium"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Price</h3>
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-4 py-2 bg-pink-100 text-white placeholder-gray-400 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Reset Button */}
            <button
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition duration-200"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </button>
          </div>

          {/* Products */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">
              {products?.length} Products Found
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div key={p._id} className="shadow-lg rounded-lg">
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
