const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;
const User = require("./models/User");
const app = express();
const session = require("express-session");

// Database of existing emails
const existingEmails = new Set();

console.log(__dirname);
app.set("views", path.join(__dirname, "/../templates/views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "/../templates/views/partials"));
app.use(express.static(path.join(__dirname, "/../public")));
app.use(
  session({
    secret: "your-secret-key", // Replace with a strong and secure key
    resave: true,
    saveUninitialized: true,
  })
);
// Use express.urlencoded() to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", { title: "Your Page Title" });
});

// Registration page
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/aboutUs", (req, res) => {
  res.render("aboutUs");
});
app.get("/sponsor", (req, res) => {
  res.render("sponsor");
});
// Login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

// Registration POST request
app.post("/register", async (req, res) => {
  const registrationData = req.body;
  const newRegistration = new User(registrationData);

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: registrationData.email });
    if (existingUser) {
      return res.render("register", { error: "Email already exists" });
    }

    // Save the new registration data to the database
    const savedRegistration = await newRegistration.save();
    console.log("Registration saved:", savedRegistration);
    res.render("payment"); // Send response indicating successful registration
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: Registration failed"); // Send error response if registration fails
  }
});

// Login POST request
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If user does not exist, render login page with error message
    if (!user) {
      return res.render("login", { error: "Invalid email or password" });
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords match, set user in session and redirect to home page
    if (passwordMatch) {
      req.session.user = user;
      return res.redirect("/");
    } else {
      // If passwords don't match, render login page with error message
      return res.render("login", { error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).render("login", { error: "Login failed. Please try again later" });
  }
});

// Payment page
app.get("/payment", (req, res) => {
  res.render("payment");
});

// POST route to handle form submission and store UPI ID
app.post("/payment", async (req, res) => {
  const { email, upiId } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found. Please register first.");
    }

    // Update the user's UPI ID
    user.upiId = upiId;

    // Save the updated user data
    await user.save();

    // Redirect the user to a success page or any other page as needed
    res.redirect("/success");
  } catch (error) {
    console.error("Error storing UPI ID:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/success" , (req,res) =>{
  res.render("success")
})
app.get("/generate_qr", (req, res) => {
  const { upiId } = req.query;
  const qrCodeUrl = generateQRCodeUrl(upiId);

  // Send the QR code URL as a response
  res.send(qrCodeUrl);
});

// Function to generate QR code URL (Replace this with your actual QR code generation logic)
function generateQRCodeUrl(upiId) {
  // Placeholder URL, replace it with actual URL
  return `https://example.com/qr?upiId=${upiId}`;
}

// Check if email exists GET request
app.get("/checkEmail", async (req, res) => {
  const { email } = req.query;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Database connection
const uri =
  "mongodb+srv://Ignite_n:Reverse7.0@cluster0.ti7hdil.mongodb.net";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

connect();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
``
