import express from "express";
import { __dirname } from "./utils.js"
import path from "node:path";
import viewsRouter  from "./routes/views.router.js"
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

const app = express();

//EJS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config({path: './.env'})
app.use(cookieParser())
app.use(express.static(__dirname + "/public"));

app.use('/', viewsRouter);



const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});