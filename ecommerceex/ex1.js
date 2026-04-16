import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost'

// 1.b) - 1st solution: global middleware
const globalMiddleware = (req, res, next) => {
    console.log(`1st SOL - ${req.method} ${req.url}`);
    next();
}
app.use(globalMiddleware);

// 1.b) - 2nd solution: global middleware
app.use((req, res, next) => {
    console.log(`2nd SOL - ${req.method} ${req.url}`);
    next();
});


// a) Basic routes
app.get("/", (req, res) => {
  res.send("Welcome to my Express server!");
});


// --------------------------------------------------
// c) Middleware only for /users routes
// --------------------------------------------------
const usersMiddleware = (req, res, next) => {
  console.log("Accessing users route");
  next();
};

app.use("/users", usersMiddleware);

// a) Basic routes
app.get("/users", (req, res) => {
  res.send("Get all users");
});

// a) Basic routes
app.post("/users", (req, res) => {
  res.send("Create a new user");
});

// --------------------------------------------------
// d) Route /test with 2 middlewares
// --------------------------------------------------
const middleware1 = (req, res, next) => {
  console.log("Middleware 1");
  next();
};

const middleware2 = (req, res, next) => {
  console.log("Middleware 2");
  next();
};

// a) Basic routes: try swapping middleware1 and middleware2
app.get("/test", middleware1, middleware2, (req, res) => {
  res.send("Testing middleware chain");
});

// e) middleware to check if query parameter "psswd" exists
const hasPsswdQuery = (req, res, next) => {
  if (!req.query.psswd) {
    //return res.status(401).json({ message: "No credentials" });
    // g) send to error handling middleware
    const err = new Error( "No credentials")
    err.status = 401
    return next(err )
  }
  next();
};

// e) middleware to check if query parameter "psswd" has correct value
const adminMiddleware = (req, res, next) => {
  if (req.query.psswd !== "super_secure_pass") {
    //return res.status(403).json({ message: "Access denied" });
    // g) send to error handling middleware
    const err = new Error("Access denied");
    err.status = 403;
    return next(err);
  }
  next();
};

// a) Basic routes & e) /admin route with route-specific middlewares
app.get("/admin", hasPsswdQuery, adminMiddleware, (req, res) => {
  res.send("Welcome admin");
});

// g) Global error middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

// Server start
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});