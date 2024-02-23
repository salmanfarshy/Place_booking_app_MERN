import React, { useState, useEffect } from "react";
import LinearColor from "../components/LinearColor";
import { Link } from "react-router-dom";
import axios from "axios";

function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
      setIsLoading(false);
    });
  }, []);
  // console.log(places[0]);

  const deletePlace = async (id) => {
    const response = await axios.delete("/place-delete/" + id);
    alert(response.data.message);
    setPlaces((prev) => prev.filter((place) => place._id !== id));
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-40">
        <LinearColor />
      </div>
    );

  return (
    <div className="flex flex-col items-center p-2">
      <Link
        to={"/account/place/add"}
        className="flex justify-center items-center gap-1 text-sm font-semibold bg-red-400 text-white mx-auto mt-8 py-2 px-6 rounded-full w-44 mb-8 hover:opacity-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add new place
      </Link>
      {places.length > 0 ? (
        <div className="flex flex-col lg:grid md:grid lg:grid-cols-[3fr_1fr] md:grid-cols-[3fr_1fr] lg:gap-2 md:gap-2 lg:pl-52 md:pl-44 px-16 md:px-0 lg:px-0">
          {places.map((place) => (
            <>
              <Link
                to={"/account/place/add/" + place._id}
                key={place._id}
                className="h-32 w-12/12 bg-gray-200 p-3 rounded-lg flex gap-3 mb-6"
              >
                <img
                  src={place?.photos[0].path}
                  alt=""
                  className="w-28 h-24 object-cover shrink-0"
                />
                <div className="grow">
                  <p className="font-semibold md:text-lg text-md">
                    {place?.title}
                  </p>
                  <p className="font-normal md:text-md text-sm max-w-5xl line-clamp-2">
                    {place?.description}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => deletePlace(place._id)}
                className="h-12 md:h-32 lg:w-3/12 md:w-4/12 bg-red-400 rounded-lg flex justify-center items-center hover:opacity-95 shrink-0 mb-5 md:mb-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="white"
                  className="md:w-8 md:h-8 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </>
          ))}
        </div>
      ) : (
        <>
          <div className="md:mt-20 mt-3 text-gray-600 md:text-3xl text-2xl flex justify-center w-full h-full">
            No accommodations
          </div>
          <p className="fixed bottom-0 bg-gray-50 opacity-90 w-full mt-8 text-center p-1.5 border-t gap-2 mx-3 h-10 text-sm md:text-base">
            Copyright &copy; 2024 by
            <em className="font-semibold"> Salman Farshy</em>
          </p>
        </>
      )}
    </div>
  );
}

export default PlacesPage;
