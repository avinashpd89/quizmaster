import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Login from "./Login";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      name: data.name,
      preferred_username: data.preferred_username,
      phone_number: "+91" + data.phone_number,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        userInfo
      );

      toast.success(
        res.data.message || "Signup successful! Please verify your email."
      );

      navigate(`/verify-email?username=${data.preferred_username}`);
    } catch (err) {
      // Show backend error message if exists
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 pt-[80px]">
      {/* Glass Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 relative text-white">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-gray-300 hover:text-white text-xl"
          onClick={() => {
            navigate("/");
            setTimeout(() => {
              document.getElementById("my_modal_3")?.showModal();
            }, 100);
          }}>
          ✕
        </button>

        {/* Heading */}
        <h3 className="font-extrabold text-3xl text-center mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Create Your Account
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="font-medium text-gray-200">Full Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-gray-300"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-300 text-sm">Name is required</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="font-medium text-gray-200">
              Preferred Username
            </label>
            <input
              type="text"
              {...register("preferred_username", { required: true })}
              className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-gray-300"
              placeholder="Choose a username"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="font-medium text-gray-200">Phone Number</label>
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 bg-white/20 border border-white/10 text-white rounded-lg">
                +91
              </span>

              <input
                type="text"
                maxLength={10}
                {...register("phone_number", {
                  required: true,
                  pattern: /^[0-9]{10}$/,
                })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-gray-300"
                placeholder="10-digit mobile number"
              />
            </div>
            {errors.phone_number && (
              <p className="text-red-300 text-sm">Enter valid phone number</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="font-medium text-gray-200">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-gray-300"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-medium text-gray-200">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-gray-300 pr-12"
                placeholder="Enter password"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-300">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-medium text-gray-200">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showCPassword ? "text" : "password"}
                {...register("confirmPassword", { required: true })}
                className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-gray-300 pr-12"
                placeholder="Confirm password"
              />

              <span
                onClick={() => setShowCPassword(!showCPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-300">
                {showCPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-2 rounded-lg shadow-lg transition-all">
            Create Account
          </button>

          <p className="text-center text-gray-300">
            Already have an account?{" "}
            <Link
              to="/"
              onClick={() =>
                setTimeout(() => {
                  document.getElementById("my_modal_3")?.showModal();
                }, 150)
              }
              className="text-pink-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
