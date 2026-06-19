import mongoose from "mongoose";

const uri = process.env.MONGO_URI;

export const connectDB = async () => {
  if (!uri) {
    throw new Error(
      "MONGO_URI environment variable is required. Set it in backend/.env without angle brackets."
    );
  }

  try {
    await mongoose.connect(uri, {
      dbName: "Medicare",
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log("DB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};


// ✨ Step-by-step Instructions (Follow Step 1, then Step 2, then Step 3, …)

// Step 1 — Decide where the DB will live
// Choose Atlas (cloud) or local and pick a database name you’ll use for development.

// Step 2 — Create the database deployment
// If Atlas: create a cluster. If local: start your MongoDB service (mongod) so the DB is up and reachable.

// Step 3 — Create a DB user
// Add a dedicated database user with a strong password and only the roles it needs (least privilege).

// Step 4 — Allow network access
// Whitelist your machine’s IP (or a limited set of IPs). For quick dev you may use 0.0.0.0/0 temporarily — don’t do that in production.

// Step 5 — Get the connection (driver) link
// From Atlas (or your admin), copy the connection/driver URI — this is the link you will paste into your Node code.

// Step 6 — Store the URI securely
// Put that URI into an environment variable or secrets manager (do not hard-code it into source control).

// Step 7 — Prepare your Node project
// Ensure your Node runtime and module style are set (CommonJS vs ESM) and that your MongoDB client library (e.g., mongoose) is installed.

// Step 8 — Paste the driver link into your connection code
// COPY THE DRIVE'S LINK AND PASTE IT HERE — into the mongoose.connect("") call below:

// import mongoose from "mongoose";

// export const connectDB = async ()=> {
//   await mongoose.connect("")
//   .then(() => {console.log("DB connected")})
// }


// (Replace the empty quotes "" with the connection URI you copied in Step 5.)

// Step 9 — Ensure connection runs before serving traffic
// Call your connect function during app startup and only start accepting requests after a successful connection (or handle failure gracefully).

// Step 10 — Test read & write
// From your app, perform a simple read and write to verify connectivity and permissions.

// Step 11 — Add basic error & reconnection handling
// Log failures, retry if appropriate, and handle disconnect/reconnect events so the app stays resilient.

// Step 12 — Harden for production
// Use TLS, restrict network access to known IPs/VPCs, rotate credentials regularly, and use a secrets manager in production.

// Step 13 — Monitor & alert
// Enable monitoring/alerts (latency, connection errors, auth failures) so you get notified of issues early.

// Step 14 — Document the setup
// Write a short README that lists the env variable name, where to find the URI, and any network rules so teammates can reproduce the setup.

// If you have any questions or need help, call us at 8299431275 or email hexagonsservices@gmail.com