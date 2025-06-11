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
    if(token){
        res.render("index", {isAuthenticated : true})
        }
        else{
            res.render("login", {isAuthenticated : false})
    }
})

router.post("/login", async (req,res) => {
    const {dni, password} = req.body
    try {
        const user = await personaManager.getPersonaByDNI(dni)
        if(!user){
            res.status(401).send("Usuario no encontrado")
            }
            else if(user.password != password){
                res.status(401).send("Contraseña incorrecta")
            }
            else{
                const token = jwt.sign({dni}, process.env.SECRET_KEY, {expiresIn: process.env.JWT_TIEMPO_EXPIRACION})
                const cookieOptions = {
                    expires: new Date(Date.now() + process.env.JWT_TIEMPO_EXPIRACION * 24 * 60 * 60 * 100),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions)
            res.status(200).json({ success: true, message: 'Bienvenido' });

    }} catch (error) {
        res.status(500).json({success: false , message: 'Error interno del servidor'})
    }
    
})
//LOGOUT
router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });
    res.send(`
        <script>
            alert('Sesión cerrada correctamente');
            window.location.href = '/login';
        </script>
    `);
    // res.redirect('/login', );  // Redirige al inicio después de cerrar sesión
});

//pagos
router.get("/pagos", (req, res) => {
    res.render("pagos");
})



//ejercicios
router.get("/ejercicios", async (req, res) => {
  try {
    const ejercicios = await ejercicioManager.getEjercicios();
    res.render('ejercicios', { ejercicios, success: null, error: null });
  } catch (e) {
    res.render('ejercicios', { ejercicios: [], success: null, error: 'Error al cargar los ejercicios' });
  }
});

router.post('/ejercicios', async (req, res) => {
  const { nombre_ejercicio } = req.body;

  try {
    await ejercicioManager.addEjercicio(nombre_ejercicio);
    const ejercicios = await ejercicioManager.getEjercicios();
    res.render('ejercicios', { ejercicios, success: 'Ejercicio creado correctamente', error: null });
  } catch (e) {
    const ejercicios = await ejercicioManager.getEjercicios();
    res.render('ejercicios', { ejercicios, success: null, error: e.message || 'Error al crear el ejercicio' });
  }
});

router.post('/ejercicios/delete', async (req, res) => {
  try {
    await ejercicioManager.deleteEjercicio(req.body.nombre);
    res.redirect('/ejercicios');
  } catch (e) {
    const ejercicios = await ejercicioManager.getEjercicios();
    res.render('ejercicios', { ejercicios, success: null, error: 'Error al eliminar ejercicio' });
  }
});
router.post('/ejercicios/editar', async (req, res) => {
  const { nombre_viejo, nombre_nuevo } = req.body;

  try {
    await ejercicioManager.updateEjercicio(nombre_viejo, nombre_nuevo);
    const ejercicios = await ejercicioManager.getEjercicios();
    res.render('ejercicios', { ejercicios, success: 'Ejercicio actualizado', error: null });
  } catch (e) {
    const ejercicios = await ejercicioManager.getEjercicios();
    res.render('ejercicios', { ejercicios, success: null, error: 'Error al actualizar ejercicio' });
  }
});


async function cargarDatos() {
  const [rutinas, ejercicios, alumnos] = await Promise.all([
    rutinaManager.getRutinas(),
    ejercicioManager.getEjercicios(),
    personaManager.getAlumnos()
  ]);
  return { rutinas, ejercicios, alumnos };
  
}


//rutinas

// GET /rutinas
router.get('/rutinas', async (req, res) => {
  try {
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: null,
      error:   null
    });
  } catch (e) {
    res.render('rutinas', {
      rutinas:    [],
      ejercicios: [],
      alumnos:    [],
      success:    null,
      error:      'Error al cargar datos'
    });
  }
});

// POST /rutinas — crear
router.post('/rutinas', async (req, res) => {
  const { Nombre_rutina } = req.body;
  try {
    await rutinaManager.addRutina(Nombre_rutina);
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: 'Rutina creada',
      error:   null
    });
  } catch {
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: null,
      error:   'Error al crear rutina'
    });
  }
});

// POST /rutinas/editar — renombrar
router.post('/rutinas/editar', async (req, res) => {
  const { nombre_viejo, nombre_nuevo } = req.body;
  try {
    await rutinaManager.updateRutina(nombre_viejo, nombre_nuevo);
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: 'Rutina actualizada',
      error:   null
    });
  } catch {
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: null,
      error:   'Error al actualizar rutina'
    });
  }
});

// POST /rutinas/delete — eliminar
router.post('/rutinas/delete', async (req, res) => {
  const { nombre } = req.body;
  try {
    await rutinaManager.deleteRutina(nombre);
    return res.redirect('/rutinas');
  } catch {
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: null,
      error:   'Error al eliminar rutina'
    });
  }
});

// POST /rutinas/asignar — asignar a alumno
router.post('/rutinas/asignar', async (req, res) => {
  const { Nombre_rutina, DNI } = req.body;
  try {
    await rutinaManager.assingRutinaToAlumno(Nombre_rutina, DNI);
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: 'Rutina asignada',
      error:   null
    });
  } catch {
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: null,
      error:   'Error al asignar rutina'
    });
  }
});

// POST /rutinas/ejercicio — agregar ejercicio
router.post('/rutinas/ejercicio', async (req, res) => {
  const { Nombre_rutina, Nombre_ejercicio, repeticiones, peso } = req.body;
  try {
    await rutinaManager.addEjercicioToRutina(
      Nombre_rutina,
      Nombre_ejercicio,
      repeticiones,
      peso
    );
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: 'Ejercicio agregado',
      error:   null
    });
  } catch {
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: null,
      error:   'Error al agregar ejercicio'
    });
  }
});




export default router