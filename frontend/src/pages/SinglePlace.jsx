import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import LinearColor from "../components/LinearColor";
import AddressLink from "../components/AddressLink";
import PlaceGallery from "../components/PlaceGallery";
import PlaceDescription from "../components/PlaceDescription";
import BookingWidget from "../components/BookingWidget";

function SinglePlace() {
  const [place, setPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailDescrib, setDetailDescrib] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    async function initialFetch() {
      await axios.get("/all-places/" + id).then((response) => {
        setPlace(response.data);
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

  return (
    <>
      <div className="flex justify-center bg-gray-100 lg:mt-28 md:mt-32 mt-56 z-0 mb-16">
        <div className=" px-12 pt-4 w-10/12">
          <h1 className="text-3xl">{place.title}</h1>
          <AddressLink>{place.address}</AddressLink>
          <PlaceGallery place={place} />
          <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
            <div>
              <div className="my-4">
                <h2 className="font-semibold text-2xl">Description</h2>
                {detailDescrib ? (
                  <PlaceDescription
                    placeDes={place.description}
                    onDisable={setDetailDescrib}
                  />
                ) : (
                  <p className="line-clamp-3">{place.description}</p>
                )}

                <button
                  onClick={() => setDetailDescrib(true)}
                  className="mt-2 font-semibold text-lg underline flex items-center gap-2"
                >
                  show more{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mt-1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </button>
              </div>
              Check-in: {place.checkIn}
              <br />
              Check-out: {place.checkOut}
              <br />
              Max number of guests: {place.maxGuests}
            </div>
            <div>
              <BookingWidget place={place} />
            </div>
          </div>
          <div className="bg-white -mx-8 px-8 py-8 border-t mb-5">
            <div>
              <h2 className="font-semibold text-2xl">Extra info</h2>
            </div>
            <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
              {place.extraInfo}
            </div>
          </div>
        </div>
      </div>
      <p className="fixed bottom-0 bg-gray-50 opacity-90 w-full mt-8 text-center p-1.5 border-t gap-2 mx-3 h-10 text-sm md:text-base">
        Copyright &copy; 2024 by
        <em className="font-semibold"> Salman Farshy</em>
      </p>
    </>
  );
}

export default SinglePlace;
