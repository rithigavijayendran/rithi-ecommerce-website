import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { data: productData, refetch } = useGetProductByIdQuery(params._id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (productData) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setImage(productData.image || "");
      setStock(productData.countInStock || "");
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProduct({
        productId: params._id,
        productData: {
          image,
          name,
          description,
          price,
          category,
          quantity,
          brand,
          countInStock: stock,
        },
      });

      if (response.error) {
        toast.error(response.error.data?.message || "Failed to update product");
      } else {
        toast.success("Product updated successfully");
        navigate("/admin/allproductslist");
        refetch();
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await deleteProduct(params._id);
      toast.success(`"${response?.data?.name}" deleted successfully`);
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 text-white flex flex-col items-center py-10">
      <div className="w-full max-w-6xl bg-gray-400 p-6 rounded-lg shadow-lg">
        <AdminMenu />
        <h2 className="text-2xl font-bold text-center mb-6">Update/Delete Product</h2>

        {image && (
          <div className="text-center mb-4">
            <img src={image} alt="product" className="mx-auto max-h-40 rounded-lg shadow" />
          </div>
        )}

        <div className="mb-4 text-center">
          <label className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg cursor-pointer font-bold inline-block truncate max-w-xs">
            {image ? `Change Image` : "Upload Image"}
            <input type="file" name="image" accept="image/*" onChange={uploadFileHandler} className="hidden" />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Brand</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full p-3 h-24 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="flex space-x-4 mt-6">
            <button type="submit" className="py-3 px-6 rounded-lg bg-green-600 hover:bg-green-700">
              Update
            </button>
            <button type="button" onClick={handleDelete} className="py-3 px-6 rounded-lg bg-red-600 hover:bg-red-700">
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdate;
