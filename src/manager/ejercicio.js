import { pool } from "../db/poolConfig.js";

export default class EjercicioManager{
    constructor(){
        this.pool = pool;
    }

    async addEjercicio(nombreEjercicio){
            try {
                    await this.pool.query('INSERT INTO Ejercicio Nombre_ejercicio = ?', 
                        [nombreEjercicio]);
            } catch (e) {
                console.error("Error al agregar ejercicio",e);
                
            }
    }

    async getEjercicioByNombre(nombreEjercicio){
        try {
            await this.pool.query('SELECT * FROM Ejercicio WHERE Nombre_ejercicio = ?', [nombreEjercicio])
        }
        catch(e){
            console.error("Error al buscar ejercicio",e)
        }
    
    }

}
