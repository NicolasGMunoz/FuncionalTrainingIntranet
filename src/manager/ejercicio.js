import { pool } from "../db/poolConfig.js";

export default class EjercicioManager{
    constructor(){
        this.pool = pool;
    }

    async addEjercicio(nombreEjercicio){
            try {
                const [existe] = await this.pool.query('SELECT Nombre_ejercicio FROM Ejercicio WHERE Nombre_ejercicio = ?', [nombreEjercicio])

                if (existe.length > 0) {
            throw new Error('El ejercicio ya existe');}
        
            await this.pool.query('INSERT INTO Ejercicio (Nombre_ejercicio) VALUES (?)', 
            [nombreEjercicio]);



            } catch (e) {
                console.error("Error al agregar ejercicio",e);
            }
    }

    async deleteEjercicio(nombreEjercicio){
        try {
            await this.pool.query('DELETE FROM Ejercicio WHERE Nombre_ejercicio = ?', [nombreEjercicio])
        } catch (e) {
            console.error("Error al eliminar ejercicio", e);
        }
    }

    async getEjercicioByNombre(nombreEjercicio){
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM Ejercicio WHERE Nombre_ejercicio = ?', [nombreEjercicio])
            return rows
        }        
        catch(e){
            console.error("Error al buscar ejercicio",e)
        }
    
    }

    async updateEjercicio(nombreviejo, nombrenuevo){
        try {
            await this.pool.query('UPDATE Ejercicio SET Nombre_ejercicio = ? WHERE Nombre_ejercicio = ?', [nombrenuevo,nombreviejo])
    }
catch(e){
    console.error("Error al actualizar ejercicio",e)
}}

    async getEjercicios(){
        try {
           const [rows] = await this.pool.query('SELECT * FROM Ejercicio')
            return rows
        }
        catch(e){
            console.error("Error al buscar ejercicios",e)
        }
    
    }

}


