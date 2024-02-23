import React from "react";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext.jsx";

function Header() {
  const { user } = useContext(UserContext);

  return (
    <div className="fixed top-0 left-0 flex flex-col gap-7 mb-6 md:flex-row justify-evenly items-center md:gap-20 p-4 w-full lg:h-20 md:h-38 bg-gray-50 shrink z-50">
      <Link to="/" className="flex gap-1 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 -rotate-90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
        <p className="font-bold text-gray-700 md:text-lg text-base">
          Place-<em>booking</em>
        </p>
      </Link>

      <div className="flex border-2 py-1.5 px-3 rounded-full gap-4 shadow-md">
        <p className="border-r-2 pr-3">Anywhere</p>
        <p className="border-r-2 pr-3">Any week</p>
        <p>Add guests</p>

        <button className="bg-red-500 text-white p-1 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>

      <Link
        to={user ? "/account/profile" : "/login"}
        className="flex border-2 py-1.5 px-3 rounded-full gap-4 items-center"
      >
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
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>

        {!!user && (
          <>
            <div className="bg-gray-400 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white relative top-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <div>{user.name}</div>
          </>
        )}
      </Link>
    </div>
  );
}

export default Header;
