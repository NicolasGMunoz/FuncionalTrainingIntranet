import { pool } from "../db/poolConfig.js";

export default class RutinaManager{
    constructor(){
        this.pool = pool;
    }

    async addRutina(Nombre_rutina){
            try {
                    await this.pool.query('INSERT INTO Rutina (Nombre_rutina) = ?', 
                        [Nombre_rutina]);
            } catch (e) {
                console.error("Error al agregar clase",e);
                
            }
    }

    async getRutinaByNombre(idClase){
        try {
            await this.pool.query('SELECT * FROM Rutina WHERE Nombre_rutina = ?', [idClase])
        }
        catch(e){
            console.error(e)
        }
    
    }

}
