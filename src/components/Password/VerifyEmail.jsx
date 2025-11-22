import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthProvider";

function VerifyEmail() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [authUser, updateAuth] = useAuth();
  const [isResending, setIsResending] = useState(false);

  // Auto-fill username from URL query
  useEffect(() => {
    const usernameFromSignup = searchParams.get("username");
    if (usernameFromSignup) setValue("username", usernameFromSignup);
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-email",
        {
          username: data.username,
          code: data.code,
          password: data.password,
        }
      );

      // Update auth context
      updateAuth({
        ...response.data.user,
        accessToken: response.data.tokens.accessToken,
        refreshToken: response.data.tokens.refreshToken,
        idToken: response.data.tokens.idToken,
        expiresIn: response.data.tokens.expiresIn,
      });

      toast.success("Email Verified! Logged In Successfully");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification Failed");
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      const username = watch("username");
      if (!username) return toast.error("Username is required");

      const response = await axios.post(
        "http://localhost:5000/api/auth/resend-code",
        { username }
      );
      toast.success(response.data.message || "Code resent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-black via-pink-500 to-purple-600">
      <div className="relative w-[400px] p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20">
        <button
          onClick={() => navigate("/")}
          className="absolute right-4 top-4 text-white text-xl hover:text-red-400 transition"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Verify Your Email
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div className="flex flex-col">
            <label className="text-white font-medium mb-1">Username</label>
            <input
              type="text"
              {...register("username", { required: true })}
              className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              readOnly
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="text-white font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
              placeholder="Enter your password"
              className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-9 text-white opacity-70 hover:opacity-100 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* OTP */}
          <div className="flex flex-col">
            <label className="text-white font-medium mb-1">Verification Code</label>
            <input
              type="text"
              {...register("code", { required: true })}
              placeholder="Enter OTP from email"
              className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Resend Code */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-white text-sm opacity-80">
              Didn't receive the code?
            </span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className={`text-sm font-medium underline text-purple-200 hover:text-white transition ${
                isResending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-purple-700 text-white font-semibold shadow-lg hover:scale-105 transform transition"
          >
            Verify Email & Login
          </button>
        </form>

        <p className="text-center text-white mt-4 text-sm opacity-80">
          Already verified?{" "}
          <span className="underline cursor-pointer" onClick={() => navigate("/")}>
            Go Home
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
