import axios from "axios";
import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../userContext.jsx";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [redirect, setRedirect] = useState(false);
  const { setUser, user } = useContext(UserContext);

  async function loginUser(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("/login", { email, password });
      setUser(data);
      if (!data) {
        throw error;
      }

      alert("Login successful");
      // setRedirect(true);
      // return <Navigate to={"/"} />;
    } catch (error) {
      alert("Login Failed. Check again..");
    }
  }

  // if (redirect) {
  //   return <Navigate to={"/"} />;
  // }

  return (
    <>
      {user ? (
        <Navigate to={"/account/profile"} />
      ) : (
        <div className="md:mt-40 mt-56 grow flex flex-col justify-center items-center w-full overflow-hidden">
          <h1 className="md:text-4xl text-3xl text-center mb-4">Login</h1>
          <form
            onSubmit={loginUser}
            className="flex flex-col lg:w-1/3 md:w-2/3 w-3/4 mb-64 gap-3"
          >
            <input
              className="border-2 border-gray-100 p-2 ps-4 rounded-full outline-cyan-300 bg-gray-50"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border-2 border-gray-100 p-2 ps-4 rounded-full outline-cyan-300 bg-gray-50"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-red-500 p-2 rounded-full text-white font-semibold">
              Login
            </button>
            <div className="text-center py-2 text-gray-500">
              Don't have an account yet?{" "}
              <Link className="underline text-black" to={"/register"}>
                Register now.
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default LoginPage;
