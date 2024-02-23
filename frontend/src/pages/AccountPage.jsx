import React, { useContext, useState, useRef } from "react";
import { Navigate, Link, useParams, Outlet } from "react-router-dom";
import { UserContext } from "../userContext";

function AccountPage() {
  const { user, ready } = useContext(UserContext);
  const [clickColor, setClickColor] = useState("");

  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }

  const linkClasses = (type = "profile") => {
    let classes =
      "rounded-full py-2 px-5 text-md text-center bg-gray-100 flex justify-center items-center gap-1";
    if (type === clickColor) {
      classes += " bg-red-400 text-gray-50";
    }
    return classes;
  };

  return (
    <>
      {!user ? (
        <p>Loding...</p>
      ) : (
        <>
          <div className="lg:mt-24 md:mt-28 mt-52 mb-16">
            <nav className="flex px-7 text-center flex-col md:flex-row md:px-0 justify-center mt-4 font-semibold gap-6">
              <Link
                to={"/account/profile"}
                className={linkClasses("profile")}
                onClick={() => setClickColor("profile")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                My profile
              </Link>
              <Link
                to={"/account/bookings"}
                className={linkClasses("bookings")}
                onClick={() => setClickColor("bookings")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg>
                My bookings
              </Link>
              <Link
                to={"/account/places"}
                className={linkClasses("places")}
                onClick={() => setClickColor("places")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                  />
                </svg>
                My accommodations
              </Link>
            </nav>
            <Outlet />
          </div>
          <p className="fixed bottom-0 bg-gray-50 opacity-90 w-full mt-8 text-center p-1.5 border-t gap-2 mx-3 h-10 text-sm md:text-base">
            Copyright &copy; 2024 by
            <em className="font-semibold"> Salman Farshy</em>
          </p>
        </>
      )}
    </>
  );
}

export default AccountPage;
