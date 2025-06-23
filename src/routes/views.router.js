import { Router } from "express";
import { __dirname } from "../utils.js";
import EjercicioManager from "../manager/ejercicio.js";
import PersonaManager, { isAuthenticated } from "../manager/persona.js";
import RutinaManager from "../manager/rutina.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { promisify } from "util";

dotenv.config()
const router = Router()
const ejercicioManager = new EjercicioManager();
const personaManager = new PersonaManager();
const rutinaManager = new RutinaManager();



//index
router.get("/", (req, res) => {
  res.render("index");
})

//presentes
router.post('/buscar-alumno', async (req, res) => {
  const { dni } = req.body;
  try {
    const persona = await personaManager.getPersonaByDni(dni);
  if (!persona) {
  return res.status(401).send("Alumno no encontrado desde el back");
  }
  res.json({ success: true, nombre: persona.Nombre_completo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});


//login
router.get("/login", (req, res) => {
  res.render("login");
})


router.post("/login", async (req, res) => {
  const { dni, pass } = req.body
  try {
    const user = await personaManager.getEncargado(dni)
    if (!user) {
       return res.render("login",{error: "Usuario no encontrado"})
    }
    if (user.pass !== pass) {
      return res.render("login", { error: "Contraseña incorrecta" });
    }

      const token = jwt.sign({ dni: user.dni, rol: 'encargado' }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_TIEMPO_EXPIRACION })
      const cookieOptions = {
        httpOnly: true
      }
      res.cookie('jwt', token, cookieOptions)
      return res.redirect("/")

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' }) 
  }

})
//LOGOUT
router.get('/logout', (req, res) => {
  res.clearCookie("jwt");
  res.send(`
        <script>
            alert('Sesión cerrada correctamente');
            window.location.href = '/login';
        </script>
    `);
  return res.redirect('/login');
});


router.use(isAuthenticated);

//alumnos
router.get("/alumnos", (req, res) => {
  res.render("alumnos");
})

// crear alumno
router.post('/alumnos', async (req, res) => {
  const { dni, nombre_completo } = req.body;
  try {
    const result = await personaManager.addAlumno(dni, nombre_completo);

 res.render('index', {
      dni,
      nombre_completo,
      success: 'Alumno agregado',
      error: null
    });
  } catch (error) {
    console.error("Error inesperado:", error);
    res.render("errorAlumno");
  }
});

 router.get('/errorAlumno', (req, res) => {
 res.redirect("index")
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
      error: null
    });
  } catch (e) {
    res.render('rutinas', {
      rutinas: [],
      ejercicios: [],
      alumnos: [],
      success: null,
      error: 'Error al cargar datos'
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
      error: null
    });
  } catch {
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: null,
      error: 'Error al crear rutina'
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
      error: null
    });
  } catch {
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: null,
      error: 'Error al actualizar rutina'
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
      error: 'Error al eliminar rutina'
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
      error: null
    });
  } catch {
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: null,
      error: 'Error al asignar rutina'
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
      error: null
    });
  } catch {
    const { rutinas, ejercicios, alumnos } = await cargarDatos();
    res.render('rutinas', {
      rutinas,
      ejercicios,
      alumnos,
      success: null,
      error: 'Error al agregar ejercicio'
    });
  }
});



export default router