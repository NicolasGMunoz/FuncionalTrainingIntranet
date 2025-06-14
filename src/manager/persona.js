import { pool } from "../db/poolConfig.js";

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

    async addAlumno(dni,nombreCompleto) {
        try {
            const persona = await  this.addPersona(dni,nombreCompleto)
            if(!persona.success){
                return {success:false, message:"Error al agregar Persona", e: persona.error };
            }

            const[al] = await this.pool.query( 'INSERT INTO Alumno DNI_Persona = ?', [al.DNI])
        } catch (e) {
             console.error("Error al agregar Alumno:", e);
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

    async getPersonaByDNI(dni){
        try {
            await this.pool.query('SELECT * FROM Persona WHERE DNI = ?', [dni])
        }
        catch(e){
            console.error("Error al buscar ejercicio",e)
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

}
