// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthToken } from "../utils/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  // Login States
  const [serviceNumber, setServiceNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [isTypingServiceNumber, setIsTypingServiceNumber] = useState(false);
  const [loginMessage, setLoginMessage] = useState(""); // To display login messages
  const [isLoginSuccess, setIsLoginSuccess] = useState(false); // Manage login success state

  // Sign-Up States
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state
  const [signupFullName, setSignupFullName] = useState("");
  const [signupServiceNumber, setSignupServiceNumber] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("office"); // Default role
  const [signupOffice, setSignupOffice] = useState(""); // Only for 'office' role
  const [signupMessage, setSignupMessage] = useState(""); // To display sign-up messages
  const [isSignupSuccess, setIsSignupSuccess] = useState(false); // Manage sign-up success state

  const navigate = useNavigate();

  useEffect(() => {
    setIsTypingServiceNumber(serviceNumber !== "");
  }, [serviceNumber]);

  // Validation for Login (if any additional validation is needed)
  const validateLoginInputs = () => {
    if (!serviceNumber || !password) {
      setLoginMessage("Please enter both service number and password.");
      return false;
    }
    return true;
  };

  // Validation for Sign-Up
  const validateSignupInputs = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const serviceNumberPattern = /^(NAF\/\d+|NAF\d{2}\/\d+)$/;

    if (!signupFullName || !/^[a-zA-Z\s]+$/.test(signupFullName)) {
      setSignupMessage("Full name should contain only letters and spaces.");
      return false;
    }

    if (!emailPattern.test(signupEmail)) {
      setSignupMessage("Please enter a valid email address.");
      return false;
    }

    if (!serviceNumberPattern.test(signupServiceNumber)) {
      setSignupMessage(
        "Service number should follow the format NAF/5008 or NAF04/4566789."
      );
      return false;
    }

    if (signupPassword.length < 6) {
      setSignupMessage("Password should be at least 6 characters long.");
      return false;
    }

    if (!signupRole) {
      setSignupMessage("Please select a role.");
      return false;
    }

    if (signupRole === "office" && !signupOffice.trim()) {
      setSignupMessage("Please enter the office name.");
      return false;
    }

    return true;
  };

  // Handle Login
  const handleLogin = async () => {
    if (!validateLoginInputs()) {
      return;
    }

    try {
      console.log("Attempting login with:", { serviceNumber, password });
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          serviceNumber,
          password,
        }
      );

      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthToken(accessToken);

      setLoginMessage("Login successful!");
      setIsLoginSuccess(true);

      // Show success toast
      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Delay navigation to allow toast to be seen
      setTimeout(() => {
        if (user.role === "superadmin") {
          navigate("/superadmin-dashboard");
        } else if (user.role === "subadmin") {
          navigate("/subadmindashboard");
        } else if (user.role === "office") {
          navigate("/userdashboard");
        } else {
          navigate("/dashboard"); // Default fallback
        }
      }, 2000);
    } catch (error) {
      setLoginMessage(
        error.response?.data?.message || "Failed to log in, please try again."
      );
      toast.error("Login failed. Please check your credentials.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle Sign-Up
  // Handle Sign-Up
  const handleSignUp = async () => {
    try {
      const requestBody = {
        fullName: signupFullName,
        serviceNumber: signupServiceNumber,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
      };

      // If role is 'office', include the office name
      if (signupRole === "office") {
        requestBody.office = signupOffice;
      }

      console.log("Sending signup request with data:", requestBody); // Log the request data

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        requestBody
      );

      console.log("Received response:", response.data); // Log the response

      if (response.status === 201) {
        setSignupMessage("Sign-up successful, awaiting admin approval.");
        setIsSignupSuccess(true);
        // Reset form fields
        setSignupFullName("");
        setSignupServiceNumber("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupRole("office");
        setSignupOffice("");
      } else {
        setSignupMessage(
          response.data.message || "Failed to sign up, please try again."
        );
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setSignupMessage(
        error.response?.data?.message ||
          "An error occurred, please try again later."
      );
    }
  };
  // Handle Sign-Up Submit
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setSignupMessage("");

    if (validateSignupInputs()) {
      handleSignUp();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100">
      <ToastContainer />
      {/* Left Half - Title */}
      <div className="shadow-2xl w-full md:w-1/2 flex items-center justify-center bg-blue-300 p-6 tracking-widest rounded-full font-mono">
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
          Visitors Management <br /> System
        </h1>
      </div>

      {/* Right Half - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white rounded-lg drop-shadow-4xl">
        <div className="p-6 rounded-lg shadow-lg w-full max-w-md bg-blue-200">
          <div className="flex justify-center mb-4 bg-green-400 rounded-2xl">
            <a
              href="/adminlogin"
              className={`relative h-24 w-24 transition-transform duration-500 ${
                isPasswordFocus ? "animate-close-eyes" : ""
              } ${isTypingServiceNumber ? "animate-look-around" : ""}`}
              style={{ display: "block" }}
              aria-label="Admin Access"
            >
              <img
                src="/src/assets/pwd.png"
                alt="Character Animation"
                className="h-full w-full"
              />
            </a>
          </div>
          <div className="mb-4">
            <label
              htmlFor="serviceNumber"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Service Number
            </label>
            <input
              type="text"
              id="serviceNumber"
              value={serviceNumber}
              onChange={(e) => {
                const uppercaseValue = e.target.value.toUpperCase();
                setServiceNumber(uppercaseValue);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="NAF/0000 OR NAF00/00000"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onFocus={() => setIsPasswordFocus(true)}
              onBlur={() => setIsPasswordFocus(false)}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-around">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-se-3xl focus:outline-none focus:shadow-outline"
              type="button"
              onClick={validateLoginInputs ? handleLogin : null}
            >
              Log in🔐
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-ss-3xl focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              Sign up📝
            </button>
          </div>
          {loginMessage && (
            <p
              className={`mt-4 ${
                isLoginSuccess ? "text-green-500" : "text-red-500"
              }`}
            >
              {loginMessage}
            </p>
          )}
        </div>
      </div>

      {/* Modal for Sign-Up Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
          <div className="bg-blue-200 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up 📝</h2>
            <form onSubmit={handleSignUpSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="John Doe"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Service Number
                </label>
                <input
                  type="text"
                  value={signupServiceNumber}
                  onChange={(e) => setSignupServiceNumber(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="NAF/0000 or NAF00/00000"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  onInput={(e) =>
                    (e.target.value = e.target.value.toLowerCase())
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="youremail@example.com"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="**********"
                />
              </div>

              {/* Role Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Role
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="office">Office</option>
                  <option value="subadmin">SubAdmin</option>
                </select>
              </div>

              {/* Conditional Office Field */}
              {signupRole === "office" && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Office Name
                  </label>
                  <input
                    type="text"
                    value={signupOffice}
                    onChange={(e) => setSignupOffice(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g., Human Resources"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                >
                  Cancel
                </button>
              </div>
              {signupMessage && (
                <p
                  className={`mt-4 ${
                    isSignupSuccess ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {signupMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
