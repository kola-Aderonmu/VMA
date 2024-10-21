import React, { useState, useEffect } from "react";
import {
  fetchAutomatedResponses,
  updateAutomatedResponse,
} from "../../services/api";
import { toast, ToastContainer } from "react-toastify";

const AutomatedResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      const response = await fetchAutomatedResponses();
      setResponses(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load automated responses");
      setLoading(false);
    }
  };

  const handleUpdateResponse = async (id, enabled) => {
    try {
      await updateAutomatedResponse(id, { enabled });
      toast.success("Automated response updated successfully");
      loadResponses();
    } catch (err) {
      toast.error("Failed to update automated response");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Automated Responses</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Trigger</th>
            <th className="py-2 px-4 border-b">Response</th>
            <th className="py-2 px-4 border-b">Enabled</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response.id}>
              <td className="py-2 px-4 border-b">{response.trigger}</td>
              <td className="py-2 px-4 border-b">{response.message}</td>
              <td className="py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={response.enabled}
                  onChange={() =>
                    handleUpdateResponse(response.id, !response.enabled)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AutomatedResponses;
