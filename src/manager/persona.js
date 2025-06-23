import { pool } from "../db/poolConfig.js";
import { promisify } from "util";
import jwt from 'jsonwebtoken'


export default class PersonaManager{
    constructor(){
        this.pool = pool;
    }

    async addPersona(dni,nombreCompleto){
            try {
                    await this.pool.query('INSERT INTO Persona (DNI, Nombre_completo) VALUES (?,?)', 
                        [dni, nombreCompleto]);
            } catch (e) {
                console.error("Error al agregar Persona",e);
                
            }
    }



async addAlumno(dni, nombreCompleto) {
  try {
    const persona = await this.addPersona(dni, nombreCompleto);
const result = await this.pool.query('INSERT INTO Alumno (DNI_Persona) VALUES (?)', [dni]);
       if (!persona || !persona.success) {
      return { success: false, message: "Error al agregar Persona", e: persona?.error };
    }

 
    return { success: true, message: "Alumno agregado correctamente", DNI: dni };
  } catch (e) {
    console.error("Error al agregar Alumno:", e);
    return { success: false, message: "Error inesperado en addAlumno", e };
  }
}


    async addProfesor(dni,nombreCompleto,especialidad,pass){
        try {
            const persona = await this.addPersona(dni,nombreCompleto)
            if(!persona.success){
                return {success:false, message:"Error al agregar Persona", e: persona.error };
            }

            const[p] = await this.pool.query( 'INSERT INTO Profesor (DNI_Persona,especialidad,pass) VALUES (?,?,?)', [p.DNI, especialidad,pass])

        } catch (e) {
            
        }
    }

    async getPersonaByDni(dni) {
    try {
        const [rows] = await this.pool.query('SELECT * FROM Persona WHERE DNI = ?', [dni])
        if (rows.length === 0) {
            return null
        }
        return rows[0]
    } catch (e) {
        console.error("Error al buscar persona", e);
        return null
    }
}

    async getEncargado(dni) {
    try {
        const [rows] = await this.pool.query('SELECT DNI_Persona AS dni, Usuario AS usuario, Pass AS pass FROM Encargado WHERE DNI_Persona = ?', [dni])
        if (rows.length === 0) {
            return null
        }
        return rows[0]
    } catch (e) {
        console.error("Error al buscar persona", e);
        return null
    }
}
    async getAlumnos(){
        try {
            const [alumnos] = await this.pool.query('SELECT * FROM Alumno')
            return alumnos;
            }
            catch(e){
                console.error("Error al buscar ejercicio",e)
            return []
            }
    }


    async pagoCuota(dni){
        try {
            await this.pool.query('UPDATE alumnos SET pagocuota = 1 WHERE DNI_Persona = ?', [dni]) 
    }
  catch (e) {
    console.error("Error al agregar Pago:", e);
    return { success: false, message: "Error inesperado en pagoCuota", e };
  }
    }


}

export const isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_KEY);
    
            const [rows] = await pool.query('SELECT * FROM Encargado WHERE DNI_Persona = ?', [decoded.dni])
                if (!rows || rows[0] === 0) {
                    return res.status(401).send("No tienes permiso de acceder");
                }
                req.user = rows[0];
                return next();

        } catch (error) {
            console.log(error);
            return res.status(401).send("Token inválido o expirado");
        }
    } else {
        return res.status(401).redirect('/login');
    }}