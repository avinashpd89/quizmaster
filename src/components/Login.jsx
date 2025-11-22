import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate(); // ✅ initialize navigate
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [authUser, setAuthUser] = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username: data.username,
        password: data.password,
      });

      toast.success("Login Success!");

      setAuthUser({
        username: data.username,
        accessToken: res.data.tokens.accessToken,
        refreshToken: res.data.tokens.refreshToken,
        idToken: res.data.tokens.idToken,
        expiresIn: res.data.tokens.expiresIn,
      });

      // ✅ Close modal and redirect to home
      document.getElementById("my_modal_3")?.close();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <dialog id="my_modal_3" className="modal">
      <div
        className="modal-box rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-black/30 
        shadow-xl border border-white/20 transition-all p-8 w-[400px]">
        {/* Close Button */}
        <form method="dialog">
          {/* Close Button */}
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-white hover:text-red-400"
            onClick={() => {
              document.getElementById("my_modal_3")?.close();
              navigate("/"); // Smooth navigation
            }}>
            ✕
          </button>
        </form>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-center text-white mb-6">
          Welcome Back
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div className="flex flex-col">
            <label className="text-gray-200 font-medium mb-1">Username</label>
            <input
              type="text"
              {...register("username", { required: true })}
              placeholder="Enter your username"
              className="w-full px-4 py-2.5 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none backdrop-blur-md border border-white/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 transition"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">Username is required</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="text-gray-200 font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none backdrop-blur-md border border-white/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-10 text-white opacity-70 hover:opacity-100 transition"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">Password is required</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-pink-500/30 hover:scale-[1.02] transition-transform">
            Login
          </button>
        </form>

        <p className="text-center text-gray-300 mt-4 text-sm">
          Forgot password?{" "}
          <Link
            to="/forgot-password"
            onClick={() => document.getElementById("my_modal_3")?.close()}
            className="text-pink-400 font-medium cursor-pointer underline">
            Click here
          </Link>
        </p>

        <p className="text-center text-gray-300 mt-2 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            onClick={() => document.getElementById("my_modal_3")?.close()}
            className="text-pink-400 font-medium cursor-pointer underline">
            Sign Up
          </Link>
        </p>
      </div>
    </dialog>
  );
}

export default Login;
