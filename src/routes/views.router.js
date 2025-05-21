import { Router } from "express";
import { __dirname } from "../utils.js";
import ClaseManager from "../manager/clase.js";
import EjercicioManager from "../manager/ejercicio.js";
import PersonaManager from "../manager/persona.js";
import RutinaManager from "../manager/rutina.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


const router = Router()
const claseManager = new ClaseManager();
const ejercicioManager = new EjercicioManager();
const personaManager = new PersonaManager();
const rutinaManager = new RutinaManager();
dotenv.config()



//index
router.get("/", (req, res) => {
    res.render("index");
})

//login
router.get("/login", (req, res) => {
    res.render("login");
})

//pagos
router.get("/pagos", (req, res) => {
    res.render("pagos");
})

//rutinas
router.get("/rutinas", (req, res) => {
    res.render("rutinas");
})






export default router