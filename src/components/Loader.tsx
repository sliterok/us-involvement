import React from "react";
import "./Loader.css";

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p>Loading map data...</p>
    </div>
  );
};

export default Loader;
