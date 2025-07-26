import crearApp from "../index.js";
import Libros from '../models/mongodb/Libros.js'
import {Usuario} from '../schemes/Usuarios.js';



crearApp(Libros, Usuario);