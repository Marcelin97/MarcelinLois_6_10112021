const http = require('http');
const app = require('./app');

const cors = require("cors");

app.set("port", process.env.PORT || 3000);
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// // parse requests of content-type - application/json
// app.use(express.json());

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// // simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to bezkoder application." });
// });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
