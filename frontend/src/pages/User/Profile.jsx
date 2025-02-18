import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Update Profile
        </h2>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-pink-300"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-pink-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-pink-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-pink-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="bg-pink-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-pink-600 transition"
            >
              Update
            </button>

            <Link
              to="/user-orders"
              className="bg-gray-700 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-800 transition"
            >
              My Orders
            </Link>
          </div>

          {loadingUpdateProfile && <Loader />}
        </form>
      </div>
    </div>
  );
};

export default Profile;
