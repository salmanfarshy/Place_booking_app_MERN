import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import { UserContextProvider } from "./userContext";
import axios from "axios";
import ProfilePage from "./pages/ProfilePage";
import PlacesPage from "./pages/PlacesPage";
import HomePage from "./pages/HomePage";
import PlaceFormPage from "./pages/PlaceFormPage";
import SinglePlace from "./pages/SinglePlace";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/place/:id" element={<SinglePlace />} />
            <Route path="/account" element={<AccountPage />}>
              <Route path="/account/profile" element={<ProfilePage />} />
              <Route path="/account/bookings" element={<BookingsPage />} />
              <Route path="/account/bookings/:id" element={<BookingPage />} />
              <Route path="/account/places" element={<PlacesPage />} />
              <Route
                path="/account/place/add/:id?"
                element={<PlaceFormPage />}
              />
            </Route>
            {/* <Route path="/account/bookings" element={<AccountPage />} />
            <Route path="/account/places" element={<AccountPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
