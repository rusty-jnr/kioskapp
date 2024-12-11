import bcrypt from "bcrypt";
import { user, appointmentModel } from "../models/userModel.js";

class Controller {
  // route to dashboard
  static dashboard_get = (req, res) => {
    res.render("dashboard.ejs");
  };

  // route to g-test page
  static g_test_get = async (req, res) => {
    res.render("g-test.ejs");
    // try {
    //   const userId = req.session.user._id;
    //   // Check if the user already has an upcoming appointment
    //   const existingUser = await user.findById(userId).populate("appointment");
      
    //   if (existingUser.appointment) {
    //     const currentDate = new Date();
    //     const appointmentDate = new Date(existingUser.appointment.date);

    //     if (appointmentDate >= currentDate) {
    //       const upcomingAppointment = `${existingUser.appointment.date} - ${existingUser.appointment.time}`;
    //       res.render("g-test.ejs", {
    //         info: { upcomingAppointment }
    //       });
    //       return;
    //     }
    //   }
    // } catch (error) {
    //   res.render("g-test.ejs", {
    //     message: {
    //       message: `Error fetching user information: ${error?.message || error}`,
    //       type: "danger",
    //     },
    //   });
    // };
  };

  static g_test_update = async (req, res) => {
    try {
      const id_to_update = req.params.user_id_to_update;

      const data = req.body;

      const updated_user = await user.findByIdAndUpdate(
        { _id: id_to_update },
        {
          car_details: {
            make: data.carMake,
            model: data.carModel,
            year: data.carYear,
            platno: data.plateNumber,
          },
        },
        { new: true }
      );

      if (updated_user) {
        const updated_info = { ...updated_user._doc };
        delete updated_info.password;
        req.session.user = updated_user;
        res.render("g-test.ejs", {
          user: updated_info,
          message: {
            message: "User information updated successfully.",
            type: "success",
          },
        });
      }
    } catch (err) {
      res.render("g-test.ejs", {
        message: { message: `Error: ${err?.message || err}`, type: "danger" },
      });
    }
  };

  // route to g2-test page
  static g2_test_get = async (req, res) => {
    res.render("g2-test.ejs");
    // try {
    //   const userId = req.session.user._id;
    //   // Check if the user already has an upcoming appointment
    //   const existingUser = await user.findById(userId).populate("appointment");
      
    //   if (existingUser.appointment) {
    //     const currentDate = new Date();
    //     const appointmentDate = new Date(existingUser.appointment.date);

    //     if (appointmentDate >= currentDate) {
    //       const upcomingAppointment = `${existingUser.appointment.date} - ${existingUser.appointment.time}`;
    //       res.render("g2-test.ejs", {
    //         info: { upcomingAppointment }
    //       });
    //       return;
    //     }
    //   }
    // } catch (error) {
    //   res.render("g2-test.ejs", {
    //     message: {
    //       message: `Error fetching user information: ${error?.message || error}`,
    //       type: "danger",
    //     },
    //   });
    // };
  };

  static g2_test_post = async (req, res) => {
    try {
      const id_to_update = req.params.user_id_to_update;
      const data = req.body;

      // Check for existing license_no
      const existingLicense = await user.findOne({
        license_no: data.licenseNumber,
      });
      if (existingLicense) {
        throw new Error("License number already exists.");
      }

      // Check for existing platno in car_details
      const existingPlatno = await user.findOne({
        "car_details.platno": data.plateNumber,
      });
      if (existingPlatno) {
        throw new Error("Car plate number already exists.");
      }

      const user_to_update = await user.findByIdAndUpdate(
        { _id: id_to_update },
        {
          first_name: data.firstName,
          last_name: data.lastName,
          license_no: data.licenseNumber,
          age: data.age,
          car_details: {
            make: data.carMake,
            model: data.carModel,
            year: data.carYear,
            platno: data.plateNumber,
          },
          profileComplete: true,
        },
        { new: true }
      );

      if (user_to_update) {
        const updated_info = { ...user_to_update._doc };
        delete updated_info.password;
        req.session.user = updated_info;
        res.render("g2-test.ejs", {
          message: {
            message: "User information updated successfully.",
            type: "success",
          },
          user: req.session.user,
        });
      }
    } catch (error) {
      res.render("g2-test.ejs", {
        message: {
          message: `Error creating user: ${error?.message || error}`,
          type: "danger",
        },
      });
    }
  };

  // available time slots
  static available_time_slots_post = async (req, res) => {
    const { date, page } = req.body;
    try {
      const slots = await appointmentModel.find({
        date,
        isTimeSlotAvailable: true,
      });
      res.render(`${page === "G2" ? "g2-test.ejs" : "g-test.ejs"}`, {
        slots: {
          slots,
          title: slots?.length
            ? `Available time slot(s) for ${date}`
            : `No available time slot(s) for ${date}`,
        },
      });
    } catch (error) {
      res.render(`${page === "G2" ? "g2-test.ejs" : "g-test.ejs"}`, {
        message: {
          message: `Error fetching available slots: ${error?.message || error}`,
          type: "danger",
        },
      });
    }
  };

  // book appointment
  static book_appointment_post = async (req, res) => {
    const { slotId, date, page } = req.body;
    try {
      const userId = req.session.user._id;

      // Check if the user already has an upcoming appointment
      const existingUser = await user.findById(userId).populate("appointment");
      if (existingUser.appointment) {
          const currentDate = new Date();
          const appointmentDate = new Date(existingUser.appointment.date);

          if (appointmentDate >= currentDate && existingUser.test_status_label === "") {
              throw new Error(
                  "You already have an upcoming appointment"
              );
          }
      }

      const appointment = await appointmentModel.findById(slotId);
      if (!appointment || !appointment.isTimeSlotAvailable) {
        throw new Error("Appointment slot not available");
      }

      appointment.isTimeSlotAvailable = false;
      appointment.driver = userId; // Link the appointment to the user
      const updated_appointment = await appointment.save();

      if (updated_appointment) {
        // Update the user's test type based on the page
        const testType = page === "G2" ? "G2" : "G"; // Determine test type
        const updated_user = await user.findByIdAndUpdate(
          userId, // User ID from the request
          {
            test_type: testType,
            test_status_label: "",
            comment: "",
            appointment: updated_appointment._id
          },
          { new: true } // Return the updated document
        );

        if (!updated_user) {
          throw new Error("User not found or could not be updated");
        }

        const slots = await appointmentModel.find({
          date,
          isTimeSlotAvailable: true,
        });

        res.render(`${page === "G2" ? "g2-test.ejs" : "g-test.ejs"}`, {
          slots: {
            slots,
            title: slots?.length
              ? `Available time slot(s) for ${date}`
              : `No available time slot(s) for ${date}`,
          },
          message: {
            message: `Appointment booked successfully on ${date} at ${appointment.time}`,
            type: "success",
          },
        });
      }
    } catch (error) {
      res.render(`${page === "G2" ? "g2-test.ejs" : "g-test.ejs"}`, {
        message: {
          message: `Error booking appointment: ${error?.message || error}`,
          type: "danger",
        },
      });
    }
  };

  // examiner get drivers
  static examiner_get = async (req, res) => {
    try {
      const { testType } = req.query; // Optional filter for G/G2
      const query = {
        user_type: "Driver", // Ensure the user is a Driver
        test_type: { $ne: "" }, // Ensure the test_type is not empty (i.e., has booked an appointment)
        test_status_label: { $eq: "", $ne: "Pass", $ne: "Fail" }, // Ensure test_status_label is not set
      };

      if (testType) {
        query.test_type = testType; // Apply filter for specific test type (G or G2)
      }

      const drivers = await user.find(query).populate("appointment");

      res.render("examiner.ejs", {
        drivers,
        message: null,
      });
    } catch (error) {
      res.render("examiner.ejs", {
        drivers: [],
        message: {
          message: `Error fetching drivers: ${error.message}`,
          type: "danger",
        },
      });
    }
  };

  // examiner update drivers
  static examiner_update = async (req, res) => {
    try {
      const { driver_id } = req.params;
      const { comment, testResult } = req.body;

      const driver = await user.findByIdAndUpdate(
        driver_id,
        {
          comment,
          test_status_label: testResult,
          test_status: true,
        },
        { new: true }
      );

      if (driver) {
        res.redirect("/examiner");
      } else {
        throw new Error("Driver not found");
      }
    } catch (error) {
      res.render("examiner.ejs", {
        message: {
          message: `Error updating driver: ${error.message}`,
          type: "danger",
        },
      });
    }
  };

  // admin listing test result
  static admin_results_get = async (req, res) => {
    try {
      const { testStatus } = req.query; // Optional filter: Pass or Fail

      // Build the query
      const query = {
        user_type: "Driver", // Ensure the user is a Driver
        test_type: { $ne: "" }, // Check that test_type is not empty
      };

      if (testStatus) {
        query.test_status_label = testStatus; // Add test status filter if provided
      }

      // Fetch users who have booked an appointment
      const drivers = await user
        .find(query)
        .select(
          "first_name last_name license_no car_details test_type test_status_label appointment"
        );

      res.render("admin-results.ejs", {
        drivers,
        message: null,
      });
    } catch (error) {
      res.render("admin-results.ejs", {
        drivers: [],
        message: {
          message: `Error fetching test results: ${error.message}`,
          type: "danger",
        },
      });
    }
  };

  // route to login / signup page
  static login_get = (req, res) => {
    res.render("login.ejs");
  };

  static login_post = async (req, res) => {
    try {
      const data = req.body;

      // get user record based on email as criteria in find({}) method
      const user_to_match = await user.findOne({ user_name: data.username });

      if (user_to_match) {
        const password_match = await bcrypt.compare(
          data.password,
          user_to_match.password
        );
        if (!password_match) {
          throw new Error("Invalid password. Please try again.");
        }

        user_to_match.password = undefined;
        req.session.user = user_to_match;
        res.redirect("/g2-test");
      } else {
        throw new Error("User not found. Please sign up.");
      }
    } catch (error) {
      res.render("login.ejs", {
        message: {
          message: `Error logging in: ${error?.message || error}`,
          type: "danger",
        },
      });
    }
  };

  static signup_post = async (req, res) => {
    const data = req.body;

    try {
      // Check for existing user_name
      const existingUser = await user.findOne({ user_name: data.username });
      if (existingUser) {
        throw new Error("Username already exists.");
      }

      const hashed_password = await bcrypt.hash(data.password, 10);

      const user_to_save = new user({
        user_name: data.username,
        password: hashed_password,
        user_type: data.userType,
      });
      const user_saved = await user_to_save.save();
      if (user_saved) {
        res.render("login.ejs", {
          message: {
            message: "User signed up successfully. Please login.",
            type: "success",
          },
        });
      }
    } catch (error) {
      res.render("login.ejs", {
        message: {
          message: `Error creating user: ${error?.message || error}`,
          type: "danger",
        },
      });
    }
  };

  // route to appointment page
  static appointment_get = async (req, res) => {
    try {
      const slots = await appointmentModel.find().sort({ createdAt: -1 });
      res.render("appointment.ejs", {slots});
    } catch (error) {
      res.render("appointment.ejs", {
        slots: [],
        message: {
          message: `Error fetching slots: ${error?.message || error}`,
          type: "danger",
        },
      });
    }
  };

  static appointment_post = async (req, res) => {
    try {
      const { timeSlots } = req.body;
      const dateTimePairs = timeSlots.split(",");

      // Map each date-time pair to an object with 'date' and 'time' properties
      const formattedAppointments = dateTimePairs.map((pair) => {
        // Split each pair by ' - ' to separate the date and time
        const [date, time] = pair.trim().split(" - ");
        return { date, time, isTimeSlotAvailable: true };
      });

      const existingSlots = await appointmentModel.find({
        $or: formattedAppointments.map((slot) => ({
          date: slot.date,
          time: slot.time,
        })),
      });

      const newSlots = formattedAppointments.filter(
        (slot) =>
          !existingSlots.some(
            (existing) =>
              existing.date === slot.date && existing.time === slot.time
          )
      );

      // Save each time slot as a separate document
      if (newSlots.length > 0) {
        // Insert only the new time slots
        const saved_slot = await appointmentModel.insertMany(newSlots);

        const successMsg = () => {
          if (newSlots.length === formattedAppointments.length) {
            return `Appointment slots have been created successfully!`;
          } else {
            const diff = formattedAppointments.length - newSlots.length;
            return `${newSlots.length} Appointment(s) slots have been created successfully and ${diff} Appointment(s) already exist.`;
          }
        };

        if (saved_slot) {
          const slots = await appointmentModel.find().sort({ createdAt: -1 });
          return res.render("appointment.ejs", {
            slots,
            message: {
              message: successMsg(),
              type: "success",
            },
          });
        }
      }

      // If no new slots were added
      throw new Error(
        "No new appointment slots were added. All specified slots already exist."
      );
    } catch (error) {
      res.render("appointment.ejs", {
        message: {
          slots: [],
          message: `Error creating appointment slots:: ${
            error?.message || error
          }`,
          type: "danger",
        },
      });
    }
  };

  // route to logout
  static logout_get = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("/login");
      }
      res.clearCookie("drving-test");
      res.redirect("/login");
    });
  };

  // route 404
  static not_found = (req, res) => {
    res.render("404.ejs");
  };
}

export default Controller;
