import { useContext, useEffect, useState, useRef } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../userContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  if (place.maxGuests < numberOfGuests) {
    setNumberOfGuests(numberOfGuests - 1);
    alert(`Can't place guests more than ${place.maxGuests}`);
  }

  async function bookThisPlace() {
    if (!user) {
      alert("you have to login first.");
      setRedirect("/login");
      return;
    }
    const response = await axios.post("/booking-place", {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    if (bookingId) {
      alert("Booking has been placed . . .");
      setRedirect("/");
    } else alert("Something wrong booking failed . . .");
    console.log(bookingId);
    // setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <div className="text-2xl text-center">Price: ${place.price} /night</div>
      <div className="border rounded-md mt-4">
        <div className="flex md:flex-row flex-col">
          <div className="py-3 px-4">
            <label className="font-semibold" htmlFor="check in">
              Check in:
            </label>
            <input
              ref={inputRef}
              id="check in"
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 md:border-l border-t">
            <label className="font-semibold" htmlFor="check out">
              Check out:
            </label>
            <input
              id="check out"
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label className="font-semibold" htmlFor="number of guests">
            Number of guests:
          </label>
          <input
            id="number of guests"
            className="w-full border border-black rounded-md py-1 px-2 outline-cyan-500"
            type="number"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <div className="flex flex-col mb-2">
              <label htmlFor="full name" className="font-semibold">
                Your full name:
              </label>
              <input
                id="full name"
                className="w-full border border-black rounded-md py-1 px-2 outline-cyan-500"
                type="text"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone number" className="font-semibold">
                Phone number:
              </label>
              <input
                id="phone number"
                className="w-full border border-black rounded-md py-1 px-2 outline-cyan-500"
                type="tel"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => {
          !!(checkIn && checkOut && numberOfGuests && name && phone)
            ? bookThisPlace()
            : inputRef.current.focus();
        }}
        className="bg-red-500 text-white w-full mt-4 rounded-md p-2 font-semibold"
      >
        Book this place
        {numberOfNights > 0 && (
          <span className="text-sm"> ${numberOfNights * place.price}</span>
        )}
      </button>
    </div>
  );
}
