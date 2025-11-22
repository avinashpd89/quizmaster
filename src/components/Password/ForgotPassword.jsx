import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = confirm OTP
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  // Send OTP
  const sendOtp = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        username: data.username,
      });
      toast.success("OTP sent to email");
      setStep(2); // move to confirm step
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  // Confirm OTP and reset password
  const confirmOtp = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/auth/confirm-forgot-password", {
        username: data.username,
        code: data.code,
        newPassword: data.password,
      });
      toast.success("Password reset successfully");
      reset();
      setStep(1);
      navigate("/"); // redirect to login after reset
    } catch (error) {
      toast.error("Password reset failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <div className="relative w-[400px] p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-xl border border-white/20">
        {/* Close button → go back to login */}
        <button
          className="absolute top-4 right-4 text-white text-xl hover:text-red-400 transition"
          onClick={() =>
                setTimeout(() => {
                  document.getElementById("my_modal_3").showModal();
                }, 150)
              }
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        <form
          onSubmit={handleSubmit(step === 1 ? sendOtp : confirmOtp)}
          className="space-y-5"
        >
          <div className="flex flex-col">
            <label className="text-white font-medium mb-1">Username</label>
            <input
              type="text"
              {...register("username", { required: true })}
              placeholder="Enter your username"
              className="px-4 py-3 rounded-xl bg-white/10 placeholder-white text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
            />
          </div>

          {step === 2 && (
            <>
              <div className="flex flex-col">
                <label className="text-white font-medium mb-1">OTP Code</label>
                <input
                  type="text"
                  {...register("code", { required: true })}
                  placeholder="Enter OTP"
                  className="px-4 py-3 rounded-xl bg-white/10 placeholder-white text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                />
              </div>

              <div className="flex flex-col relative">
                <label className="text-white font-medium mb-1">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Enter new password"
                  className="px-4 py-3 rounded-xl bg-white/10 placeholder-white text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm pr-12"
                />
                <button
                  type="button"
                  className="absolute right-4 top-10 text-white opacity-70 hover:opacity-100 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-2xl text-white font-semibold shadow-lg 
            ${step === 1 ? "bg-purple-600 hover:bg-purple-700" : "bg-green-600 hover:bg-green-700"} 
            transition transform hover:scale-105`}
          >
            {step === 1 ? "Send OTP" : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-white mt-4 text-sm opacity-80">
          {step === 2 ? "Want to resend OTP?" : "Remember your password? "}
          {step === 2 && (
            <span
              className="underline cursor-pointer"
              onClick={() => setStep(1)}
            >
              Go back
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
