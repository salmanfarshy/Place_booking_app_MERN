import React, { useState, useContext } from "react";
import axois from "axios";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../userContext.jsx";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [comfirm_password, setComfirm_password] = useState("");
  const { user, setUser } = useContext(UserContext);
  // const [redirect, setRedirect] = useState(false);

  if (user) {
    // alert("you've already registered.");
    return <Navigate to={"/account/profile"} />;
  }

  async function registerUser(e) {
    e.preventDefault();
    try {
      const pass1 = password,
        pass2 = comfirm_password;
      const compareVal = pass1.localeCompare(pass2);

      if (!name || !email || !password || !comfirm_password)
        throw Error("All fields are required Check again.");

      if (compareVal !== 0) {
        setName("");
        setEmail("");
        setPassword("");
        setComfirm_password("");
        throw Error("Password and confirm password must be same.");
      }

      const { data } = await axois.post("/register", {
        name,
        email,
        password,
        comfirm_password,
      });
      console.log(data);

      setUser(data);
      setName("");
      setEmail("");
      setPassword("");
      setComfirm_password("");
      alert("Registration successful. Now you can login.");
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className="md:mt-32 mt-52 grow flex flex-col justify-center items-center w-full">
      <h1 className="md:text-4xl text-3xl text-center mb-4">Register</h1>
      <form
        onSubmit={registerUser}
        className="flex flex-col lg:w-1/3 md:w-2/3 w-3/4 mb-64 gap-3"
      >
        <input
          className="border-2 border-gray-100 p-2 ps-4 rounded-full outline-cyan-200"
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border-2 border-gray-100 p-2 ps-4 rounded-full outline-cyan-200"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border-2 border-gray-100 p-2 ps-4 rounded-full outline-cyan-200"
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="border-2 border-gray-100 p-2 ps-4 rounded-full outline-cyan-200"
          type="password"
          name="comfirm_password"
          placeholder="confirm password"
          value={comfirm_password}
          onChange={(e) => setComfirm_password(e.target.value)}
        />
        <button className="bg-red-500 p-2 rounded-full text-white font-semibold">
          Register
        </button>
        <div className="text-center py-2 text-gray-500">
          If you have already account?{" "}
          <Link className="underline text-black" to={"/login"}>
            login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
