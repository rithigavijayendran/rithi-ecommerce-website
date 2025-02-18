import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <section className="flex flex-wrap items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white h-[50rem] w-[90%] md:w-[45%] xl:block md:block sm:block flex flex-col items-center justify-center rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-[12rem] mt-[10rem]">Create Account</h1>
        <form onSubmit={submitHandler} className="w-[90%] space-y-4">
          <div className="relative ml-[5rem]">
            <FaUser className="absolute top-4 left-3 text-gray-500" />
            <input
              type="text"
              className="pl-10 p-3 border rounded w-full focus:ring focus:ring-pink-300"
              placeholder="Full Name"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative ml-[5rem]">
            <FaEnvelope className="absolute top-4 left-3 text-gray-500" />
            <input
              type="email"
              className="pl-10 p-3 border rounded w-full focus:ring focus:ring-pink-300"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative ml-[5rem]">
            <FaLock className="absolute top-4 left-3 text-gray-500" />
            <input
              type="password"
              className="pl-10 p-3 border rounded w-full focus:ring focus:ring-pink-300"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="relative ml-[5rem]">
            <FaLock className="absolute top-4 left-3 text-gray-500" />
            <input
              type="password"
              className="pl-10 p-3 border rounded w-full focus:ring focus:ring-pink-300"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white  py-3 px-8 ml-[17rem] rounded hover:bg-pink-600 transition duration-300"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          {isLoading && <Loader />}
        </form>
        <p className="text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-pink-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
      <img
        src="https://d1v0ynld5x949x.cloudfront.net/Images/20634/10480744_image.jpg?format=auto&width=640&quality=70"
        alt="Register Illustration"
        className="h-[50rem] w-[90%] md:w-[45%] xl:block md:block sm:block mt-6 md:mt-0 rounded-lg"
      />
    </section>
  );
};

export default Register;
