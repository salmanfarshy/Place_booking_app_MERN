import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import BookingDates from "../components/BookingDates";
import LinearColor from "../components/LinearColor";

function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/booking-place").then((response) => {
      setBookings(response.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-40">
        <LinearColor />
      </div>
    );

  return (
    <div className="mt-12 flex flex-col items-center shrink">
      {bookings?.length > 0 ? (
        bookings.map((booking) =>
          booking.place ? (
            <Link
              key={booking._id}
              to={`/account/bookings/${booking._id}`}
              className="flex md:flex-row flex-col gap-4 bg-gray-200 rounded-2xl overflow-hidden md:mb-5 mb-8 w-9/12"
            >
              <div className="md:w-48 md:h-32 h-auto">
                <img
                  src={booking.place?.photos[0].path}
                  alt=""
                  className="object-cover md:h-full h-48 w-full p-2 rounded-s-2xl"
                />
              </div>
              <div className="md:py-3 md:pr-3 grow">
                <h2 className="md:text-xl text-lg font-semibold md:ml-0 ml-4">
                  {booking.place.title}
                </h2>
                <div>
                  <BookingDates
                    booking={booking}
                    className="mb-1.5 md:mt-3 mt-2 text-gray-500 md:text-lg text-base md:ml-0 ml-4"
                  />
                  <div className="flex gap-1 items-center md:ml-0 ml-4 md:mb-0 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    <p className="md:text-lg text-base font-semibold">
                      Total price:{" "}
                      <span className="font-normal">${booking.price}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div
              className="bg-gray-200 w-9/12 rounded-2xl h-32 flex flex-col justify-center items-center"
              style={{ wordSpacing: "0.2rem" }}
            >
              <p className="md:text-2xl text-lg md:p-0 p-1 text-red-700">
                Place has been removed by owner
              </p>
              <p className="md:text-2xl text-lg md:p-0 p-1 text-red-700">
                Booking has canceled
              </p>
            </div>
          )
        )
      ) : (
        <div className="md:mt-20 mt-1 text-gray-600 md:text-3xl text-2xl flex justify-center w-full h-full">
          No bookings
        </div>
      )}
    </div>
  );
}

export default BookingPage;
