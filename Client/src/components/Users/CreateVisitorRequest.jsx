// src/components/User/CreateVisitorRequest.jsx
import React, { useState } from "react";
import { createVisitorRequest } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorHandler from "../common/ErrorHandler";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateVisitorRequest = ({ isOpen, onClose }) => {
  const [mainVisitor, setMainVisitor] = useState({
    title: "",
    name: "",
    gender: "",
    phone: "",
    purpose: "",
    officeOfVisit: "",
    visitDate: "",
    visitTime: "",
    photo: null,
  });
  const [additionalVisitors, setAdditionalVisitors] = useState([]);
  const [newVisitorName, setNewVisitorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleMainVisitorChange = (e) => {
    const { name, value } = e.target;
    setMainVisitor((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoUpload = (e) => {
    setMainVisitor((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const addVisitor = () => {
    if (newVisitorName.trim()) {
      setAdditionalVisitors((prev) => [...prev, newVisitorName.trim()]);
      setNewVisitorName("");
    }
  };

  const removeVisitor = (index) => {
    setAdditionalVisitors((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    if (!mainVisitor.title.trim()) errors.title = "Title is required";
    if (!mainVisitor.gender) errors.gender = "Gender is required";
    if (!mainVisitor.officeOfVisit.trim())
      errors.officeOfVisit = "Office of Visit is required";
    if (!mainVisitor.name.trim()) errors.name = "Name is required";
    if (!mainVisitor.purpose.trim()) errors.purpose = "Purpose is required";
    if (!mainVisitor.visitDate) errors.visitDate = "Visit date is required";
    if (!mainVisitor.visitTime) errors.visitTime = "Visit time is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      // Add main visitor data
      Object.keys(mainVisitor).forEach((key) => {
        if (key === "photo" && mainVisitor[key]) {
          formData.append("photo", mainVisitor[key]);
        } else {
          formData.append(key, mainVisitor[key]);
        }
      });

      if (additionalVisitors.length > 0) {
        formData.append(
          "additionalVisitors",
          JSON.stringify(additionalVisitors)
        );
      }

      const response = await createVisitorRequest(formData);
      console.log("API response:", response);
      // Show toast notification regardless of `success` check
      toast.success("Visitor request created successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      if (response.success) {
        // Reset form and close modal
        setMainVisitor({
          title: "",
          name: "",
          gender: "",
          phone: "",
          purpose: "",
          officeOfVisit: "",
          visitDate: "",
          visitTime: "",
          photo: null,
        });
        setAdditionalVisitors([]);
        onClose();
      }
    } catch (error) {
      setError(error.message || "Failed to create visitor request");
      console.error("Error creating visitor request:", error);

      // Display error toast notification
      toast.error("Failed to create visitor request. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-600 bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-4/5 lg:w-3/4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Create Visitor Request
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {error && <ErrorHandler error={error} />}
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={mainVisitor.title}
                        onChange={handleMainVisitorChange}
                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.title ? "border-red-500" : ""
                        }`}
                        placeholder="e.g., Mr, Mrs, Dr"
                        required
                      />
                      {formErrors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visitor Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={mainVisitor.name}
                        onChange={handleMainVisitorChange}
                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.name ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={mainVisitor.gender}
                        onChange={handleMainVisitorChange}
                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.gender ? "border-red-500" : ""
                        }`}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                      {formErrors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.gender}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="08012345678"
                        value={mainVisitor.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,11}$/.test(value)) {
                            handleMainVisitorChange(e); // Ensures that only numbers up to 11 digits are allowed
                          }
                        }}
                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.phone ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Office of Visit
                      </label>
                      <input
                        type="text"
                        name="officeOfVisit"
                        value={mainVisitor.officeOfVisit}
                        onChange={handleMainVisitorChange}
                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.officeOfVisit ? "border-red-500" : ""
                        }`}
                        placeholder="Enter the office or department name"
                        required
                      />
                      {formErrors.officeOfVisit && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.officeOfVisit}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose of Visit
                      </label>
                      <input
                        type="text"
                        name="purpose"
                        value={mainVisitor.purpose}
                        onChange={handleMainVisitorChange}
                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.purpose ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.purpose && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.purpose}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visit Date
                      </label>
                      <input
                        type="date"
                        name="visitDate"
                        value={mainVisitor.visitDate}
                        onChange={handleMainVisitorChange}
                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.visitDate ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.visitDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.visitDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visit Time
                      </label>
                      <input
                        type="time"
                        name="visitTime"
                        value={mainVisitor.visitTime}
                        onChange={handleMainVisitorChange}
                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.visitTime ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.visitTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.visitTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Photo (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Additional Visitors
                    </h3>
                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        value={newVisitorName}
                        onChange={(e) => setNewVisitorName(e.target.value)}
                        className="flex-grow px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Visitor Name"
                      />
                      <button
                        type="button"
                        onClick={addVisitor}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {additionalVisitors.map((visitor, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md"
                        >
                          {visitor}
                          <button
                            type="button"
                            onClick={() => removeVisitor(index)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      disabled={isSubmitting}
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateVisitorRequest;
