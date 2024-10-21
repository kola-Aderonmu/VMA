import React from "react";
import { toast } from "react-toastify";

const TestToast = () => {
  const handleClick = () => {
    toast("Test toast!", { type: "info" });
  };

  return <button onClick={handleClick}>Show Toast</button>;
};

export default TestToast;
