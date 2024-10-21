import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaTrashAlt, FaBell } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
import { MdOutlineHomeWork } from "react-icons/md";

// Simulated WebSocket connection
const useWebSocket = (setNotifications) => {
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulating incoming real-time notifications
      setNotifications((prev) => [
        ...prev,
        { id: prev.length + 1, type: "New Real-Time Notification" },
      ]);
    }, 10000); // Every 10 seconds for example
    return () => clearInterval(interval);
  }, [setNotifications]);
};

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [visitors, setVisitors] = useState([
    {
      title: "",
      name: "",
      surname: "",
      phoneNumber: "",
      address: "",
      officeOfVisit: "",
      timeOfVisit: "",
      purpose: "",
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "User Authorization Request" },
    { id: 2, type: "New Visitor Request" },
  ]);

  // WebSocket hook for real-time updates
  useWebSocket(setNotifications);

  const handleAddVisitor = () => {
    setVisitors([
      ...visitors,
      {
        title: "",
        name: "",
        surname: "",
        phoneNumber: "",
        address: "",
        officeOfVisit: "",
        timeOfVisit: "",
        purpose: "",
      },
    ]);
  };

  const handleRemoveVisitor = (index) => {
    const updatedVisitors = visitors.filter((_, i) => i !== index);
    setVisitors(updatedVisitors);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedVisitors = [...visitors];

    if (name === "officeOfVisit" || name === "name" || name === "address") {
      updatedVisitors[index][name] = value.toUpperCase();
    } else if (name === "phoneNumber") {
      // Remove any non-digit characters
      const numericValue = value.replace(/\D/g, "");
      updatedVisitors[index][name] = numericValue;
    } else {
      updatedVisitors[index][name] = value;
    }

    setVisitors(updatedVisitors);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.location.href = "/login";
    }
  };

  const handleBellClick = () => {
    const audio = new Audio("/sounds/notification.mp3"); // Path to your notification sound
    audio.play();
    setShowNotifications(!showNotifications);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(visitors);
    try {
      const response = await fetch("/api/visitors/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ visitors }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Visitors submitted successfully:", result);

        // Optionally notify the office of visit here

        // Reset visitors state after submission
        setVisitors([
          {
            title: "",
            name: "",
            surname: "",
            phoneNumber: "",
            address: "",
            officeOfVisit: "",
            timeOfVisit: "",
          },
        ]);

        setShowModal(false); // Close modal
      } else {
        console.error("Failed to submit visitors");
      }
    } catch (error) {
      console.error("Error submitting visitors:", error);
    }
  };

  return (
    <div>
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl rounded-b-lg p-6 flex flex-col md:flex-row md:justify-between items-center">
        <div className="text-5xl font-extrabold animate-zoomInOut mb-4 md:mb-0">
          VMS
        </div>
        <nav className="flex flex-col md:flex-row justify-around w-full md:w-11/12 font-semibold space-y-4 md:space-y-0">
          <a
            href="/dashboard"
            className="hover:text-yellow-300 flex items-center space-x-2 md:pl-96"
          >
            <MdOutlineHomeWork />
            <span>Home</span>
          </a>
          <span className="hidden md:inline">|</span>
          <button
            onClick={() => setShowModal(true)}
            className="hover:text-yellow-300 flex items-center space-x-2"
          >
            <FaPlusCircle />
            <span>Create Visitor</span>
          </button>

          {/* Notification Bell */}
          <div className="relative flex items-center">
            <button
              onClick={handleBellClick}
              onMouseEnter={handleBellClick} // Show on hover
              onMouseLeave={() => setShowNotifications(false)} // Hide when not hovering
              className="relative flex items-center hover:text-yellow-300"
            >
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                {notifications.length}
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-8 right-0 bg-white text-black w-64 shadow-lg rounded-lg p-4 z-10">
                <h3 className="font-bold mb-2">Notifications</h3>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="border-b py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {notification.type}
                  </div>
                ))}
              </div>
            )}
          </div>

          <span className="hidden md:inline">|</span>
          <button
            onClick={handleLogout}
            className="hover:text-yellow-300 flex items-center space-x-2"
          >
            <RiLogoutCircleFill />
            <span>Log Out</span>
          </button>
        </nav>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white w-full max-w-screen-lg md:w-3/4 lg:w-6/4 h-full overflow-auto p-8 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
              Visitor Details
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {visitors.map((visitor, index) => (
                <div key={index} className="space-y-4 border-b pb-4 mb-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      name="title"
                      placeholder="Title (e.g., Mr, Mrs, Dr)"
                      value={visitor.title}
                      onChange={(event) => handleInputChange(index, event)}
                      className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="FULL NAME"
                      value={visitor.name}
                      onChange={(event) => handleInputChange(index, event)}
                      style={{ textTransform: "uppercase" }}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                    />

                    {/* Remove visitor button */}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVisitor(index)}
                        className="text-red-500 hover:text-red-700 ml-4"
                      >
                        <FaTrashAlt className="text-lg" />
                      </button>
                    )}
                  </div>

                  {/* Full details only for the first visitor */}
                  {index === 0 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                          type="tel"
                          name="phoneNumber"
                          placeholder="+234"
                          value={visitor.phoneNumber}
                          onChange={(event) => handleInputChange(index, event)}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          minLength="6"
                          maxLength="12"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                        />

                        <input
                          type="text"
                          name="address"
                          placeholder="ADDRESS"
                          value={visitor.address}
                          onChange={(event) => handleInputChange(index, event)}
                          style={{ textTransform: "uppercase" }}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                        />
                        <input
                          type="text"
                          name="officeOfVisit"
                          placeholder="OFFICE OF VISIT"
                          value={visitor.officeOfVisit}
                          onChange={(event) => handleInputChange(index, event)}
                          style={{ textTransform: "uppercase" }}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                        />

                        <select
                          name="purpose"
                          value={visitor.purpose}
                          onChange={(event) => handleInputChange(index, event)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                        >
                          <option value="" disabled>
                            PURPOSE OF VISIT
                          </option>
                          <option value="OFFICIAL">OFFICIAL</option>
                          <option value="VISIT">VISIT</option>
                          <option value="PRESENTATION">PRESENTATION</option>
                          <option value="INFORMAL">INFORMAL</option>
                        </select>
                        <input
                          type="time"
                          name="timeOfVisit"
                          placeholder="Time of Visit"
                          value={visitor.timeOfVisit}
                          onChange={(event) => handleInputChange(index, event)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddVisitor}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                Add Another Visitor
              </button>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ease-in-out mt-4"
              >
                Submit Visitors
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
