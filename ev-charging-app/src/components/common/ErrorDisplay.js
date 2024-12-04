import React from "react";

const ErrorDisplay = ({ message }) => {
  if (!message) return null;

  return (
    <div className='container mx-auto mt-4'>
      <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
        {message}
      </div>
    </div>
  );
};

export default ErrorDisplay;
