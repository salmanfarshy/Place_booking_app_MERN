import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LinearColor from "../components/LinearColor";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialFetch() {
      await axios.get("/all-places").then((response) => {
        setPlaces(response.data);
        setIsLoading(false);
      });
    }
    initialFetch();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-72">
        <LinearColor />
      </div>
    );

  if (!places.length)
    return (
      <>
        <div className="mt-64 text-gray-600 md:text-3xl text-2xl flex justify-center w-full h-full">
          No places
        </div>
        <p className="fixed bottom-0 bg-gray-50 opacity-90 w-full mt-8 text-center p-1.5 border-t gap-2 mx-3 h-10 text-sm md:text-base">
          Copyright &copy; 2024 by
          <em className="font-semibold"> Salman Farshy</em>
        </p>
      </>
    );

  return (
    <>
      <div className="lg:mt-28 md:mt-32 mt-52 mx-8 px-2 py-2 grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-16">
        {places.length > 0 &&
          places.map((place) => (
            <Link to={"/place/" + place._id} key={place._id}>
              <div className="flex flex-col w-12/12">
                {place.photos?.[0] && (
                  <div className="rounded-2xl w-78 h-64 overflow-hidden shrink-0">
                    <img
                      className="object-cover h-full w-full"
                      src={place?.photos[0].path}
                      alt="Square Image"
                    />
                  </div>
                )}

                <h2 className="font-bold mt-2 truncate">{place.address}</h2>
                <h3 className="text-sm text-gray-500 truncate">
                  {place.title}
                </h3>
                <div className="mt-1">
                  <span className="font-bold">${place.price}</span> night
                </div>
              </div>
            </Link>
          ))}
      </div>
      <p className="fixed bottom-0 bg-gray-50 opacity-90 w-full mt-8 text-center p-1.5 border-t gap-2 mx-3 h-10 text-sm md:text-base">
        Copyright &copy; 2024 by
        <em className="font-semibold"> Salman Farshy</em>
      </p>
    </>
  );
}
