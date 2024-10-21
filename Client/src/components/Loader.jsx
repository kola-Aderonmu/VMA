import React, { useEffect, useState } from "react";
import backgroundImage from "/src/assets/bgi3.jpg";

const Loader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30); // Adjusting this controls the speed of the progress bar

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(onFinish, 100); // Delay before switching to login
    }

    return () => clearInterval(interval);
  }, [progress, onFinish]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="w-64 bg-white bg-opacity-80 p-4 rounded-lg">
        <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-center mt-2 text-gray-700 italic font-mono">
          Loading {progress}%
        </div>
      </div>
    </div>
  );
};

export default Loader;
