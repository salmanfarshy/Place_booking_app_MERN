import React, { useContext, useState } from "react";
import { UserContext } from "../userContext";
import axios from "axios";
import { Navigate } from "react-router-dom";

function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  const logout = async () => {
    await axios.post("/logout");
    setUser(null);
    setRedirect(true);
  };

  const userDelete = async () => {
    try {
      const { data } = await axios.delete("/user-delete");
      alert(data);
      // console.log(data);
      setUser(null);
      setRedirect(true);
    } catch (error) {
      alert("The user couldn't deleted.");
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex items-center justify-center w-12/12 md:mt-20 mt-8">
      <div className="flex flex-col items-start justify-center font-semibold gap-4">
        <p className="p-2 px-4 bg-gray-200 w-full rounded-lg">
          User name: <span className="font-normal">{user?.name}</span>
        </p>
        <p className="p-2 px-4 bg-gray-200 w-full rounded-lg">
          User email: <span className="font-normal">{user?.email}</span>
        </p>

        <button
          onClick={logout}
          className="bg-red-400 text-gray-50 rounded-lg p-1 w-80 mt-2 hover:opacity-95"
        >
          Logout
        </button>
        <div className="border-t mt-1 pt-0.5">
          <button
            onClick={userDelete}
            className="bg-red-400 text-gray-50 rounded-lg p-1 w-80 mt-2 hover:opacity-95"
          >
            Deactivate account
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
