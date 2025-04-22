import { Router } from "express";
import { __dirname } from "../utils.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


const router = Router()
dotenv.config()

router.get("/", (req, res) => {
    res.render("index");
})

export default router