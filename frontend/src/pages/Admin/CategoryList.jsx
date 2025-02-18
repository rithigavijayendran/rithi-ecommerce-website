import { useState, useEffect } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories, refetch } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        refetch();
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    try {
        const result = await deleteCategory(selectedCategory._id).unwrap();
        toast.success(`${result.name} is deleted`);
        refetch();
        setSelectedCategory(null);
        setModalVisible(false);
      }
     catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="ml-[5rem] flex flex-col md:flex-row bg-gray-100 min-h-screen p-6">
      <AdminMenu />
      <div className="bg-white min-h-screen p-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
          Manage Categories
        </h2>

        <div className="mt-4">
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700">Existing Categories</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
            {categories?.map((category) => (
              <button
                key={category._id}
                className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg shadow-md hover:bg-pink-500 hover:text-white transition-all duration-300"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Update Category
            </h3>
            <CategoryForm
              value={updatingName}
              setValue={(value) => setUpdatingName(value)}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
