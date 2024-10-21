import React, { useState } from "react";

const VisitorsRegister = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState(null); // Modal state

  const dummyData = [
    {
      id: 1,
      name: "Mark",
      contact: "1478520000",
      gender: "Male",
      building: "C",

      whomToVisit: "Billy",
      entryTime: "2024-09-11 11:56:53", // Today's date for testing
    },
    {
      id: 1,
      name: "John billy",
      contact: "1478520000",
      gender: "Male",
      building: "Annex Building",

      whomToVisit: "Billy",
      entryTime: "2024-09-11 11:56:53", // Today's date for testing
    },
    {
      id: 2,
      name: "Russell Womble",
      contact: "14789632140",
      gender: "Male",
      building: "D",

      whomToVisit: "Jeniffer",
      entryTime: "2024-09-10 12:26:05",
    },
    // Add more dummy data as needed
  ];

  const filteredData = dummyData.filter((visitor) =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to check if the visitor entry is today
  const isToday = (entryTime) => {
    const today = new Date();
    const visitorDate = new Date(entryTime);
    return (
      visitorDate.getDate() === today.getDate() &&
      visitorDate.getMonth() === today.getMonth() &&
      visitorDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 shadow-slate-500 shadow-lg rounded-lg p-4">
        All Visitor's Entry
      </h2>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="entries" className="mr-2 text-gray-600">
            Show:
          </label>
          <select
            id="entries"
            className="border rounded p-1 text-gray-600 focus:ring focus:outline-none"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
          <span className="ml-2 text-gray-600">entries</span>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded p-2 focus:ring focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">📝</th>
              <th className="py-3 px-6 text-left">Visitor's Name</th>
              <th className="py-3 px-6 text-left">Visitor's Contact</th>
              <th className="py-3 px-6 text-left">Gender</th>
              <th className="py-3 px-6 text-left">Building</th>
              <th className="py-3 px-6 text-left">Whom To Visit</th>
              <th className="py-3 px-6 text-left">Entry Time</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {filteredData.length > 0 ? (
              filteredData.map((visitor, index) => (
                <tr
                  key={visitor.id}
                  className={`border-b border-gray-200 hover:bg-gray-100 shadow-md ${
                    isToday(visitor.entryTime) ? "bg-yellow-200" : ""
                  }`} // Highlight today's visitors
                >
                  <td className="py-3 px-6 text-left">{index + 1}</td>
                  <td className="py-3 px-6 text-left">{visitor.name}</td>
                  <td className="py-3 px-6 text-left">{visitor.contact}</td>
                  <td className="py-3 px-6 text-left">{visitor.gender}</td>
                  <td className="py-3 px-6 text-left">{visitor.building}</td>
                  <td className="py-3 px-6 text-left">{visitor.whomToVisit}</td>
                  <td className="py-3 px-6 text-left">{visitor.entryTime}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition"
                      onClick={() => setSelectedVisitor(visitor)} // Open modal with visitor details
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-3 px-6 text-center text-gray-500">
                  No visitors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedVisitor && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4 text-center">
              Visitor Details
            </h3>
            <p>
              <strong>Name:</strong> {selectedVisitor.name}
            </p>{" "}
            <br />
            <p>
              <strong>Contact:</strong> {selectedVisitor.contact}
            </p>{" "}
            <br />
            <p>
              <strong>Gender:</strong> {selectedVisitor.gender}
            </p>{" "}
            <br />
            <p>
              <strong>Building:</strong> {selectedVisitor.building}
            </p>{" "}
            <br />
            <p>
              <strong>Whom to Visit:</strong> {selectedVisitor.whomToVisit}
            </p>{" "}
            <br />
            <p>
              <strong>Entry Time:</strong> {selectedVisitor.entryTime}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => setSelectedVisitor(null)} // Close modal
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorsRegister;
