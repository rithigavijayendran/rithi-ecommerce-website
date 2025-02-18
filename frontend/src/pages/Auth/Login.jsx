import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Successfully logged in!");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <section className="flex flex-wrap items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white h-[50rem] w-[90%] md:w-[45%] xl:block md:block sm:block rounded-lg flex flex-col items-center justify-center shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-[13rem] mt-[10rem]">Welcome Back!</h1>
        <p className="text-gray-500 text-center mb-6 mr-[2rem]">
          Please sign in to your account
        </p>

        <form onSubmit={submitHandler} className="w-[90%] space-y-4">
          {/* Email Input */}
          <div className="relative ml-[5rem]">
            <AiOutlineMail className="absolute top-4 left-3 text-gray-500" />
            <input
              type="email"
              className="pl-10 p-3 border rounded w-full focus:ring focus:ring-pink-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative ml-[5rem]">
            <AiOutlineLock className="absolute top-4 left-3 text-gray-500" />
            <input
              type="password"
              className="pl-10 p-3 border rounded w-full focus:ring focus:ring-pink-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              required
            />
          </div>

          {/* Sign In Button */}
          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white py-3 px-8 ml-[16rem] rounded hover:bg-pink-600 transition duration-300"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          {isLoading && <Loader />}
        </form>

        {/* Register Link */}
        <p className="text-gray-600 text-center mt-4">
          Don't have an account?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-pink-500 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
      <img
        src="https://u-static.haozhaopian.net/uid_d1993ef342a34445b8495944b25d014c/aiImage/b4ac307bca1947ce84473d3ec4358393.jpg"
        alt="Login Illustration"
        className="h-[50rem] w-[95%] md:w-[45%] xl:block md:block sm:block rounded-lg mt-6 md:mt-0"
      />
    </section>
  );
};

export default Login;
