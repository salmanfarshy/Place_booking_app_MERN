import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Perks from "../components/Perks";
import { Navigate, useParams } from "react-router-dom";
import LinearColor from "../components/LinearColor";

function PlaceFormPage() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState(Number);
  const [checkOut, setCheckOut] = useState(Number);
  const [maxGuests, setMaxGuests] = useState(Number);
  const [price, setPrice] = useState(Number);
  const [getPhotoLink, setGetPhotoLink] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const hasRendered = useRef(false);
  const favNumberRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    async function initialFetch() {
      if (!id) {
        return;
      }
      const response = await axios.get("/user-places/" + id);
      const { data } = response;
      let perksData = null;
      if (!data.perks[1]) {
        perksData = data.perks[0];
        perksData = perksData.split(",");
      } else perksData = data.perks;

      if (!hasRendered.current) {
        const images = data.photos;
        // console.log(images.length);
        // const halfIndex = Math.ceil(images.length / 2);
        // const images1 = images.slice(0, halfIndex + 1);
        // console.log(images);
        if (images.length > 1) {
          images.forEach((image) => {
            setSelectedImages((prev) => [...prev, image.path]);
          });
        } else {
          setSelectedImages([images[0].path]);
        }
        hasRendered.current = true;
      }

      setTitle(data.title);
      setAddress(data.address);
      setDescription(data.description);
      setPerks(perksData);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
      setIsLoading(false);
    }
    initialFetch();
  }, [id]);

  const updatePhotosByClick = (ev) => {
    const files = ev.target.files;
    if (!(photos.length && selectedImages.length >= 6)) {
      const newFiles = Array.from(files).map((file) => {
        const newName = `photos_${Date.now()}`;
        return new File([file], newName, { type: file.type });
      });
      setPhotos((prev) => {
        return [...prev, ...newFiles];
      });

      // Display the selected images
      const newImages = [...selectedImages];

      for (const file of files) {
        const reader = new FileReader();
        reader.onloadend = () => {
          // console.log(newImages);
          newImages.push(reader.result);
          setSelectedImages([...newImages]);
        };

        if (file) {
          reader.readAsDataURL(file);
        }
      }
    } else alert("Maximum 6 photos can be uploaded . . .");
  };

  const updatePhotosByUrl = () => {
    if (!(photos.length && selectedImages.length >= 6)) {
      if (getPhotoLink) {
        setSelectedImages((prev) => {
          return [...prev, getPhotoLink];
        });
        setGetPhotoLink("");
      } else alert('Put the valid "URL" . . .');

      if (getPhotoLink) {
        fetch(getPhotoLink)
          .then((response) => response.blob())
          .then((blob) => {
            // console.log(blob);
            const file = new File([blob], `photos_${Date.now()}`, {
              type: blob.type,
            });
            // console.log(file);
            setPhotos((prev) => {
              return [...prev, file];
            });
          })
          .catch((error) => {
            alert("Error fetching or converting the image:", error);
          });
      }
    } else {
      setGetPhotoLink("");
      alert("Maximum 6 photos can be uploaded . . .");
    }
    // console.log(photos);
  };

  const favPhoto = (ev, index) => {
    const showImage = selectedImages[index];

    setSelectedImages(
      selectedImages.filter((image, imageIndex) => imageIndex !== index)
    );
    setSelectedImages((prev) => [showImage, ...prev]);
    // setPhotos((prev) => {
    //   return [...prev, ...newFiles];
    // });
  };

  const deletePhotos = async (ev, index) => {
    if (selectedImages.length <= 1) return;

    setButtonDisabled(true);
    const deletePhoto = selectedImages[index];

    if (id && deletePhoto?.length === 99) {
      const response = await axios.post(
        "/photo-delete",
        { id, deletePhoto },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setButtonDisabled(false);
    }
    console.log(deletePhoto?.length);
    setSelectedImages(
      selectedImages.filter((image, imageIndex) => imageIndex !== index)
    );
    setButtonDisabled(false);
  };

  const handleUpdate = async () => {
    try {
      setButtonDisabled(true);
      const formData = new FormData();

      if (photos.length) {
        for (const file of photos) {
          formData.append("photos", file);
        }
      }

      const data = {
        id,
        title,
        address,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      };

      Object.keys(data).map((key) => {
        formData.append(key, data[key]);
      });

      const Response = await axios.patch("/place-update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(Response.data);
      setPhotos([]);
      setSelectedImages([]);
      setTitle("");
      setAddress("");
      setDescription("");
      setExtraInfo("");
      setPerks([]);
      setCheckIn(0);
      setCheckOut(0);
      setMaxGuests(0);
      setPrice(0);
      setButtonDisabled(false);
      setRedirect(true);
    } catch (error) {
      setButtonDisabled(false);
      alert(error);
    }
  };

  const handleUpload = async () => {
    try {
      setButtonDisabled(true);

      const formData = new FormData();

      const data = {
        title,
        address,
        perks,
        description,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      };

      if (!photos.length) {
        setButtonDisabled(false);
        throw new Error("All fields are required please check . . .");
      } else {
        for (const file of photos) {
          formData.append("photos", file);
        }
      }

      Object.keys(data).map((key) => {
        if (!data[key] || data[key] === "0" || !data[key].length) {
          setButtonDisabled(false);
          throw new Error("All fields are required please check . . .");
        }
        formData.append(key, data[key]);
      });

      const Response = await axios.post("/place-create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(Response);
      alert(Response.data);
      setPhotos([]);
      setSelectedImages([]);
      setTitle("");
      setAddress("");
      setDescription("");
      setExtraInfo("");
      setPerks([]);
      setCheckIn(0);
      setCheckOut(0);
      setMaxGuests(0);
      setPrice(0);
      setButtonDisabled(false);
      setRedirect(true);
    } catch (error) {
      setButtonDisabled(false);
      alert(error);
    }
  };

  function preRender(head, des) {
    return (
      <>
        <p className="text-lg font-semibold text-slate-800 ms-4">{head}</p>
        <p className="text-sm font-semibold text-slate-500 ms-4">{des}</p>
      </>
    );
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  if (isLoading && id)
    return (
      <div className="flex justify-center items-center mt-52">
        <LinearColor />
      </div>
    );

  return (
    <div className=" px-32 mt-20 mb-20 flex flex-col">
      <label htmlFor="title">
        {preRender("Title", "Title for your place. Should be short . . .")}
        <input
          className="w-full mt-2 rounded-full outline-cyan-400 bg-gray-100 p-2 ps-6"
          type="text"
          id="title"
          placeholder="put the title.."
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
      </label>
      <label htmlFor="address" className=" mt-5">
        {preRender("Address", "Address to this place")}
        <input
          className="w-full mt-2 rounded-full outline-cyan-400 bg-gray-100 p-2 ps-6"
          type="text"
          id="address"
          autoComplete="off"
          placeholder="put the address.."
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
        />
      </label>
      <label htmlFor="Photos" className="mt-5">
        {preRender("Photos", "more = good")}
        <div className="flex gap-4 flex-col items-center lg:flex-row">
          <input
            className=" w-10/12 mt-2 rounded-full outline-cyan-400 bg-gray-100 p-2 ps-6"
            type="text"
            id="Photos"
            placeholder="Add using url ...jpg"
            autoComplete="off"
            value={getPhotoLink}
            onChange={(ev) => setGetPhotoLink(ev.target.value)}
          />
          <button
            onClick={updatePhotosByUrl}
            className=" w-40 bg-gray-200 rounded-xl p-2 mt-2 shrink font-bold text-md text-slate-600"
          >
            Add photo
          </button>
        </div>
      </label>
      <div className="grid items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {!!selectedImages &&
          selectedImages.map((image, index) => (
            <div
              key={index}
              className="bg-gray-200 w-48 h-28 rounded-xl relative"
            >
              <button
                onClick={(ev) => deletePhotos(ev, index)}
                className="absolute bottom-2 right-2 rounded-sm bg-gray-400 bg-opacity-30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button
                onClick={(ev) => favPhoto(ev, index)}
                className="absolute top-2 left-2 rounded-sm bg-black bg-opacity-20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={favNumberRef.current === index ? "white" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.7}
                  stroke={
                    favNumberRef.current === index ? "none" : "currentColor"
                  }
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              </button>
              <img
                className="rounded-xl object-cover w-full h-full"
                src={image}
                alt=""
              />
            </div>
          ))}

        <label className=" ms-4 h-20 w-44 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={updatePhotosByClick}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
          Upload
        </label>
      </div>
      <label htmlFor="description" className=" mt-5">
        {preRender("Description", "Description of this place")}
        <textarea
          className="w-full mt-2 rounded-2xl outline-cyan-400 bg-gray-100 p-2 ps-6 h-32 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          type="text"
          id="description"
          placeholder="put the description.."
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
      </label>
      <div htmlFor="" className=" mt-5">
        {preRender("Perks", "Select the perks of your place")}
        <Perks perks={perks} setPerks={setPerks} />
      </div>
      <label htmlFor="extra_info" className=" mt-5">
        {preRender("Extra info", "House rules, etc")}
        <textarea
          className="w-full mt-2 rounded-2xl outline-cyan-400 bg-gray-100 p-2 ps-6 h-32 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          type="text"
          id="extra_info"
          placeholder="put the extra info.."
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
      </label>
      <div className="mt-5">
        {preRender("Check in&out times", "Add check in and out times")}
        <div className="ms-4 mt-5 grid md:grid-cols-2 md:gap-3 lg:grid-cols-4 lg:gap-3 gap-3">
          <div className="flex flex-col">
            <label htmlFor="in" className="font-semibold text-sm">
              Check in time
            </label>
            <input
              className="border-2 p-1 ps-3 rounded-lg outline-cyan-400"
              type="number"
              id="in"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="out" className="font-semibold text-sm">
              Check out time
            </label>
            <input
              className="border-2 p-1 ps-3 rounded-lg outline-cyan-400"
              type="number"
              id="out"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="guest" className="font-semibold text-sm">
              Max number of guest
            </label>
            <input
              className="border-2 p-1 ps-3 rounded-lg outline-cyan-400"
              type="number"
              id="guest"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="guest" className="font-semibold text-sm">
              Price
            </label>
            <input
              className="border-2 p-1 ps-3 rounded-lg outline-cyan-400"
              type="number"
              id="guest"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>
      </div>
      <button
        disabled={isButtonDisabled}
        onClick={id ? handleUpdate : handleUpload}
        className="mt-8 p-2 bg-red-400 text-white rounded-lg ms-4 text-md font-semibold"
      >
        {id ? "Update" : "Save"}
      </button>
    </div>
  );
}

export default PlaceFormPage;
