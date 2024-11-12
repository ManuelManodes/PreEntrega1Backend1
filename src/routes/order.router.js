import { Router } from "express";
import OrderManager from "../managers/OrderManager.js";

const router = Router();
const orderManager = new OrderManager();

// Ruta para obtener todos los pedidos
router.get("/", async (req, res) => {
    try {
        const orders = await orderManager.getAll();
        res.status(200).json({ status: "success", payload: orders });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para obtener un pedido por su ID
router.get("/:id", async (req, res) => {
    try {
        const order = await orderManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: order });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para crear un nuevo pedido
router.post("/", async (req, res) => {
    try {
        const order = await orderManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: order });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para agregar un SKU a un pedido existente o incrementar su cantidad
router.post("/:orderId/sku/:skuId", async (req, res) => {
    try {
        const { orderId, skuId } = req.params;
        const { quantity } = req.body;
        const updatedOrder = await orderManager.addSkuToOrder(orderId, skuId, quantity || 1);
        res.status(200).json({ status: "success", payload: updatedOrder });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para eliminar un pedido por su ID
router.delete("/:id", async (req, res) => {
    try {
        await orderManager.deleteOneById(req.params.id);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;
