import { pool } from "../db/poolConfig.js";

export default class ClaseManager{
    constructor(){
        this.pool = pool;
    }

    async addClase(idClase,Tipo,Horario){
            try {
                    await this.pool.query('INSERT INTO Clase (idClase,Tipo,Horario) VALUES (?,?,?)', 
                        [idClase, Tipo, Horario]);
            } catch (e) {
                console.error("Error al agregar clase",e);
                
            }
    }

    async getClaseByID(idClase){
        try {
            await this.pool.query('SELECT * FROM Clase WHERE idClase = ?', [idClase])
        }
        catch(e){
            console.error(e)
        }
    
    }

}
