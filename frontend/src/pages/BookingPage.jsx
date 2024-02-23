import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../components/AddressLink";
import BookingDates from "../components/BookingDates";
import PlaceGallery from "../components/PlaceGallery";
import LinearColor from "../components/LinearColor";

export default function BookingsPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get("/booking-place").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
          setIsLoading(false);
        }
      });
    }
  }, [id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-40">
        <LinearColor />
      </div>
    );

  return (
    <div className="my-8 w-10/12 md:ms-24 ms-16">
      <h1 className="md:text-3xl text-2xl">{booking.place.title}</h1>
      <AddressLink className="my-2 flex items-center gap-1">
        {booking.place.address}
      </AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex md:flex-row flex-col md:items-center md:justify-between">
        <div>
          <h2 className="md:text-2xl text-xl mb-4">
            Your booking information:
          </h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-red-500 p-6 text-white rounded-2xl md:w-auto w-full md:mt-0 mt-5 md:h-auto h-20 flex flex-col justify-center items-center">
          <div>Total price</div>
          <div className="md:text-3xl text-2xl">${booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}
