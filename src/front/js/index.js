//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

//render your react application
ReactDOM.render(<Layout />, document.querySelector("#app"));

// const express = require("express");
// const app = express();
// require("dotenv").config();
// const stripe = require(stripe)(process.env.STRIPE_SECRET_KEY);
// const bodyParser = require("body-parser");
// const cors = require("cors");

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors());

// app.listen(process.env.PORT || 4000, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);   
// });