import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import usuarioRoutes from "./routes/Usuarios.js";
import { routeForLibros, LibrosRoute } from "./routes/Libros.js";

dotenv.config();

const app = express();

app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

//startpoint

export default function crearApp(model) {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  //--------------- Constructors ---------------//
  LibrosRoute(model);

  //--------------- Routes ---------------//
  app.use('/libros', routeForLibros);
  app.use('/auth', authRoutes);
  app.use('/usuarios', usuarioRoutes);
  //---------------//---------------//

  app.use((req, res) => {
    res.status(404).json({ message: "404 NOT FOUND" });
  });
}

//endpoints

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port http://localhost:${server.address().port}`
  );
});
