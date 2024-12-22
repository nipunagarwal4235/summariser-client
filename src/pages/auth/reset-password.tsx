import { AppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    if (
      e.currentTarget.value.length > 0 &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      e.currentTarget.value.length === 0 &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        {
          email,
        }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e?.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
          <p className="mb-4">
            Enter your registered email to reset your password
          </p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Reset Password
          </button>
        </form>
      )}

      {/* Otp Input Form */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-white p-8 rounded shadow-md w-full max-w-md mt-8"
        >
          <h1 className="text-2xl font-bold mb-4">Reset Password OTP</h1>
          <p className="mb-4">Enter the 6 digit code sent to your email</p>
          <p className="mb-4">The otp is 888888</p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  required
                  className="w-12 h-12 text-center border border-gray-300 rounded"
                  ref={(el) => (inputRefs.current[i] = el)}
                  onInput={(e) => handleInput(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
          </div>
          <button className="w-full bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
        </form>
      )}
      {/* Enter new password */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-white p-8 rounded shadow-md w-full max-w-md mt-8"
        >
          <h1 className="text-2xl font-bold mb-4">New Password</h1>
          <p className="mb-4">Enter your new password</p>
          <input
            type="password"
            required
            placeholder="Password"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
