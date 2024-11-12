import { Router } from "express";
import SkuManager from "../managers/SkuManager.js";
import uploader from "../utils/uploader.js";

const router = Router();
const skuManager = new SkuManager();

// Ruta para obtener todos los SKU
router.get("/", async (req, res) => {
    try {
        const skus = await skuManager.getAll();
        res.status(200).json({ status: "success", payload: skus });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para obtener un SKU por su ID
router.get("/:id", async (req, res) => {
    try {
        const sku = await skuManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: sku });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para crear un nuevo SKU, permite la subida de imágenes
router.post("/", uploader.single("file"), async (req, res) => {
    try {
        const sku = await skuManager.insertOne(req.body, req.file);
        res.status(201).json({ status: "success", payload: sku });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para actualizar un SKU por su ID, permite la subida de imágenes
router.put("/:id", uploader.single("file"), async (req, res) => {
    try {
        const sku = await skuManager.updateOneById(req.params.id, req.body, req.file);
        res.status(200).json({ status: "success", payload: sku });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para eliminar un SKU por su ID
router.delete("/:id", async (req, res) => {
    try {
        await skuManager.deleteOneById(req.params.id);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;
