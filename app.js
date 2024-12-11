/*jshint esversion: 11 */

console.log("******** Welcome to the Driving Test ********");

import express from "express";
import session from "express-session";
import ejs from 'ejs'

import {} from 'dotenv/config'
import path from 'path';
import { fileURLToPath } from 'url';

import router from "./routes/routes.js";


const app = express();

const port = process.env.PORT || 1010;

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view-engine", "ejs");

// To get the form data out of the request body
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'drving-test',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.set('Cache-Control', 'no-store');
  next();
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
