// import Express
import express from "express";

// create Express application
const app = express();

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

// sets the server response to a GET request on URI /
app.get("/", (req, res) => {
  console.log("GET request received at /");
  res.send("Hello World!");
});

app.get("/", (req, res) => {
  console.log(" NEW GET request received at /");
  res.json({ message: "Hello World!" });
})

app.post("/students", (req, res) => {
  console.log("POST request received at /students");
  res.json({ message: "Student created successfully!" });
});

app.all("/students", (req, res) => {
  console.log(`Received ${req.method} request at /students`);
  res.json({ message: `Handled ${req.method} request at /students` });
});

// server creation and listening for any incoming requests
app.listen(port, host, (error) => {
  console.log(`App listening at http://${host}:${port}/`);
});
