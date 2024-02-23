const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "La2?)@3i1dEXF0Q";

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(
  `mongodb+srv://salmanfarshi447:${process.env.atlasUserPassword}@booking-app.ywtvcsx.mongodb.net/?retryWrites=true&w=majority`
);

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Places_photo",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// app.post("/test", (req, res) => {
//   res.send("test");
// });

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json(null);
      }
    } else res.json(null);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json(null);
      }
    } else res.json(null);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.get("/account", (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);

      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/place-create", upload.array("photos", 6), async (req, res) => {
  try {
    const { token } = req.cookies;
    let photos = [];

    req.files.forEach((file) => {
      const val = {
        path: file.path,
        filename: file.filename,
      };

      photos.push(val);
    });

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      await Place.create({
        owner: userData.id,
        ...req.body,
        photos: photos,
      });
      res.send("Place created successfully . . .");
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Internal Server Error Please Check." });
  }
});

app.patch("/place-update", upload.array("photos", 5), async (req, res) => {
  console.log(req.files);
  const { token } = req.cookies;
  const { id } = req.body;

  let photos = [];

  req.files.forEach((file) => {
    const val = {
      path: file.path,
      filename: file.filename,
    };

    photos.push(val);
  });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);

    placeDoc.photos.forEach((file) => {
      const val = {
        path: file.path,
        filename: file.filename,
      };

      photos.unshift(val);
    });

    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({ ...req.body, photos: photos });
      await placeDoc.save();
      res.send("Place updated successfully . . .");
    }
  });
});

app.post("/photo-delete", async (req, res) => {
  const { token } = req.cookies;
  const { id, deletePhoto } = req.body;

  let photos = [];

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);

    placeDoc.photos.forEach(async (file) => {
      if (file.path !== deletePhoto) {
        const val = {
          path: file.path,
          filename: file.filename,
        };

        photos.push(val);
      } else {
        const result = await cloudinary.uploader.destroy(file.filename);
        if (result.result === "ok")
          console.log("Photo deleted from cloudinary.");
      }
    });

    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({ photos: photos });
      await placeDoc.save();
      res.send("Photo has been deleted.");
    }
  });
});

app.get("/user-places/:id?", async (req, res) => {
  const { id } = req.params;

  if (id) {
    const singlePlace = await Place.findById(id);
    res.json(singlePlace);
  } else {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      const { id } = userData;
      const placesData = await Place.find({ owner: id });
      res.json(placesData);
    });
  }
});

app.get("/all-places/:id?", async (req, res) => {
  const { id } = req.params;

  if (id) res.json(await Place.findById(id));
  else res.json(await Place.find());
});

app.delete("/place-delete/:id", async (req, res) => {
  try {
    const result = await Place.findOneAndDelete(
      { _id: req.params.id },
      { _id: 0, photos: 1 }
    );

    result.photos?.forEach(async (file) => {
      await cloudinary.uploader.destroy(file.filename);
    });

    if (!result) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/booking-place", async (req, res) => {
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;

  jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    await Booking.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      user: userData.id,
    })
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        throw err;
      });
  });
});

app.get("/booking-place", async (req, res) => {
  jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    res.json(await Booking.find({ user: userData.id }).populate("place"));
  });
});

app.delete("/user-delete", async (req, res) => {
  try {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;

      const userPlaces = await Place.find(
        { owner: userData.id },
        { _id: 1, photos: 1 }
      );

      userPlaces.forEach((place) =>
        place.photos?.forEach(async (file) => {
          await cloudinary.uploader.destroy(file.filename);
        })
      );

      const userBookings = await Booking.find(
        { user: userData.id },
        { _id: 1 }
      );
      const userPlacesIds = Array.from(userPlaces.map((place) => place._id));

      await Place.deleteMany({
        _id: { $in: userPlacesIds },
      });
      await Booking.deleteMany({ _id: { $in: userBookings } });
      await User.findOneAndDelete({ _id: userData.id });
    });
    res.cookie("token", "").json("The user has been deleted with his records.");
  } catch (error) {
    throw err;
  }
});

app.listen(4000);
