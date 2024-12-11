/*jshint esversion: 6 */

import mongoose from "mongoose";

const uri = process.env.MONGO_URI;

// const uri =
//   "mongodb+srv://lastofdnweke:September11@cluster0.fdmxw.mongodb.net/KioskApp?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("------ Connected to Mongo DB Successfully -------");
  })
  .catch((err) => {
    console.log(`Connection failed due to the error below \n ${err}`);
  });

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    default: "", // Not required for signup, can be added later
  },
  last_name: {
    type: String,
    default: "", // Not required for signup, can be added later
  },
  license_no: {
    type: String,
    default: "", // Allow empty initially
    unique: false, // Temporarily remove the unique constraint until set
  },
  age: {
    type: Number,
    default: 0, // Not required for signup
  },
  user_name: {
    type: String,
    required: true, // Required for signup
    unique: true,
  },
  password: {
    type: String,
    required: true, // Required for signup
  },
  user_type: {
    type: String,
    required: true, // Required for signup
  },
  test_type: { type: String, default: "" }, // G or G2
  comment: { type: String, default: "" },
  test_status: { type: Boolean, default: false }, // Pass or Fail
  test_status_label: { type: String, default: "" }, // Pass/Fail Label
  car_details: {
    make: {
      type: String,
      default: "", // Not required for signup, can be added later
    },
    model: {
      type: String,
      default: "", // Not required for signup, can be added later
    },
    year: {
      type: Number,
      default: 0, // Not required for signup, can be added later
    },
    platno: {
      type: String,
      default: "", // Not required for signup, can be added later
      unique: false,
    },
  },
  profileComplete: {
    type: Boolean,
    default: false, // Default is false, indicating the profile is incomplete
  },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
});

const appointmentSchema = mongoose.Schema({
  date: {
    type: String, // Date stored as string in 'DD-MM-YYYY' format
    required: true,
  },
  time: {
    type: String, // Time stored as string (e.g., '9:00')
    required: true,
  },
  isTimeSlotAvailable: {
    type: Boolean,
    default: true, // Indicates if the slot is available for booking
  },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to User
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const userModel = mongoose.model("User", userSchema);
const appointmentModel = mongoose.model("Appointment", appointmentSchema);

export { userModel as user, appointmentModel };
