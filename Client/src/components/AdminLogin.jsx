import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";

const AdminLogin = () => {
  const [serviceNumber, setServiceNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    const serviceNumberPattern = /^(NAF\/\d+|NAF\d{2}\/\d+)$/;

    if (!serviceNumberPattern.test(serviceNumber)) {
      setErrorMessage(
        "Service number should follow the format NAF/5008 or NAF04/4566789."
      );
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/superadmin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ serviceNumber, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setSuccessMessage("Login successful!");
        setTimeout(() => {
          navigate("/superadmin-dashboard");
        }, 1000);
      } else {
        setErrorMessage(data.message || "Failed to log in, please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred, please try again later.");
    }
  };

  const handleServiceNumberChange = (e) => {
    const value = e.target.value.toUpperCase().trim();
    setServiceNumber(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="w-full max-w-md bg-blue-100 p-8 rounded-3xl shadow-md">
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Return
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          SuperAdmin Login
        </h2>
        {successMessage && (
          <p className="text-green-500 text-center mb-4 flex items-center justify-center">
            <FaCheckCircle className="mr-2" /> {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Service Number
            </label>
            <input
              type="text"
              value={serviceNumber}
              onChange={handleServiceNumberChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="NAF/5008 or NAF04/4566789"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-s-xl focus:outline-none focus:shadow-outline w-full"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
