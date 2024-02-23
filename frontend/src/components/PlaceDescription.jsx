import React from "react";

function PlaceDescription({ placeDes, onDisable }) {
  return (
    <div className="fixed lg:w-10/12 lg:h-5/6 lg:top-24 md:w-9/12 md:h-5/6 md:top-24 w-9/12 h-4/6 top-52 z-10 bg-gray-50 shadow-2xl rounded-md overflow-auto shrink">
      <div className="h-16 flex justify-between items-center font-semibold border-b-2 border-gray-500 px-10">
        <p className="text-lg sm:text-xl md:text-2xl">Description</p>
        <button onClick={() => onDisable(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-lg sm:text-xl md:text-2xl"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <p className="px-12 py-4">{placeDes}</p>
    </div>
  );
}

export default PlaceDescription;
