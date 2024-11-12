import express from "express";

// Importación de enrutadores
import orderRouter from "./routes/order.router.js";
import skuRouter from "./routes/sku.router.js";

// Se crea una instancia de la aplicación Express
const app = express();

// Se define el puerto en el que el servidor escuchará las solicitudes
const PORT = 8080;

// Declaración de archivos estáticos desde la carpeta 'public'
// en la ruta 'http://localhost:8080/api/public'
app.use("/api/public", express.static("./src/public"));

// Middleware para acceder al contenido de formularios codificados en URL
app.use(express.urlencoded({ extended: true }));

// Middleware para acceder al contenido JSON de las solicitudes
app.use(express.json());

// Declaración de rutas
app.use("/api/order", orderRouter);
app.use("/api/sku", skuRouter);

// Se levanta el servidor oyendo en el puerto definido
app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});
