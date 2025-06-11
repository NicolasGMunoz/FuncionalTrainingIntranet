import { pool } from "../db/poolConfig.js";

export default class RutinaManager{
    constructor(){
        this.pool = pool;
    }

    async addRutina(Nombre_rutina){
            try {
                    await this.pool.query('INSERT INTO Rutina (Nombre_rutina) VALUES (?)', 
                        [Nombre_rutina]);
            } catch (e) {
                console.error("Error al agregar clase",e);
                
            }
    }

    async getRutinas(){
        try {
            const [result] = await this.pool.query('SELECT * FROM Rutina');
            return result;
            
        } catch (error) {
            console.error("Error al obtener rutinas", error)
            return []
        }
    }

    async getRutinaByNombre(Nombre_rutina){
        try {
            const [result]  = await this.pool.query('SELECT * FROM Rutina WHERE Nombre_rutina = ?', [Nombre_rutina])
                return result
            }
        catch(e){
            console.error(e)
        }
    
    }

    async updateRutina(nombrerutina, nombrenuevo){
        try {
            await this.pool.query('UPDATE Rutina SET Nombre_rutina = ? WHERE Nombre_rutina = ?', [nombrenuevo,nombrerutina])
            } catch (e) {
                console.error("Error al actualizar rutina", e)
                }
    }

    async deleteRutina(nombrerutina){
        try{
            await this.pool.query('DELETE FROM Rutina WHERE Nombre_rutina = ?', [nombrerutina])
            } catch (e) {
                console.error("Error al eliminar rutina", e)
                }
    }

    async assingRutinaToAlumno(nombrerutina, DNI){
        try{
            await this.pool.query(
                'INSERT INTO Alumno_usa_rutina (DNI_Persona, Nombre_rutina) VALUES (?,?)',[DNI, nombrerutina])
            }
        catch(e){
            console.error("Error al asignar rutina", e)
        }


    }
    async addEjercicioToRutina(nombrerutina, nombre_ejercicio, repeticiones, peso) {
    try {
      await this.pool.query(
        `INSERT INTO Rutina_usa_ejercicio
           (Nombre_rutina, Nombre_ejercicio, repeticiones, peso)
         VALUES (?, ?, ?, ?)`,
        [nombrerutina, nombre_ejercicio, repeticiones, peso]
      );
    } catch (e) {
      console.error("Error al asignar ejercicio a rutina", e);
      throw e;
    }
  }

}
