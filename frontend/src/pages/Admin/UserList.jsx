import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="ml-[10rem] text-2xl font-bold mb-4">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <AdminMenu /> 
          <div className="container mx-auto px-4">
  <div className="overflow-x-auto">
    <table className="w-full min-w-[800px] bg-pink-100 md:w-4/5 mx-auto border-collapse border border-gray-300">
      <thead className="border bg-gray-200">
        <tr>
          <th className="px-4 py-2 text-left text-nowrap">ID</th>
          <th className="px-4 py-2 text-left text-nowrap">NAME</th>
          <th className="px-4 py-2 text-left text-nowrap">EMAIL</th>
          <th className="px-4 py-2 text-left text-nowrap">ADMIN</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="border">
            <td className="px-4 py-2">{user._id}</td>

            <td className="px-4 py-2">
              {editableUserId === user._id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editableUserName}
                    onChange={(e) => setEditableUserName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                  <button
                    onClick={() => updateHandler(user._id)}
                    className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
                  >
                    <FaCheck />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  {user.username}
                  <button
                    onClick={() => toggleEdit(user._id, user.username, user.email)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                </div>
              )}
            </td>

            <td className="px-4 py-2">
              {editableUserId === user._id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editableUserEmail}
                    onChange={(e) => setEditableUserEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                  <button
                    onClick={() => updateHandler(user._id)}
                    className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
                  >
                    <FaCheck />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                    {user.email}
                  </a>
                  <button
                    onClick={() => toggleEdit(user._id, user.name, user.email)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                </div>
              )}
            </td>

            <td className="px-4 py-2 text-center">
              {user.isAdmin ? (
                <FaCheck className="text-green-600" />
              ) : (
                <FaTimes className="text-red-600" />
              )}
            </td>

            <td className="px-4 py-2">
              {!user.isAdmin && (
                <button
                  onClick={() => deleteHandler(user._id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                >
                  <FaTrash />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        </div>
      )}
    </div>
  );
};

export default UserList;