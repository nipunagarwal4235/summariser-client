import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";

export default function EmailVerify() {
  axios.defaults.withCredentials = true;
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);

  const navigate = useNavigate();

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

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((e) => e?.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        {
          otp,
        }
      );

      if (data.success) {
        toast.success(data.message);

        getUserData();
        navigate("/summariser");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn &&
      userData &&
      userData.isAccountVerified &&
      navigate("/summariser");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Email Verify OTP
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          Enter the 6 digit code sent to your email
        </p>
        <p className="text-gray-600 mb-4 text-center">The otp is 888888</p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                required
                className="w-12 h-12 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ref={(el) => (inputRefs.current[i] = el)}
                onInput={(e) => handleInput(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
}
