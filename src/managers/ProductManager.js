import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import ErrorManager from "./ErrorManager.js";

export default class ProductManager {
    #jsonFilename;
    #products;

    constructor() {
        this.#jsonFilename = "products.json"; // Archivo donde se almacenan los productos
    }

    async #findOneById(id) {
        this.#products = await this.getAll();
        const productFound = this.#products.find((item) => item.id === Number(id));

        if (!productFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return productFound;
    }

    async getAll(limit) {
        try {
            this.#products = await readJsonFile(paths.files, this.#jsonFilename);
            return limit ? this.#products.slice(0, limit) : this.#products;
        } catch (error) {
            throw new ErrorManager("Error al obtener los productos", 500);
        }
    }

    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async insertOne(data) {
        try {
            const { title, description, code, price, status = true, stock, category, thumbnails = [] } = data;

            if (!title || !description || !code || !price || stock === undefined || !category) {
                throw new ErrorManager("Faltan campos obligatorios", 400);
            }

            const newProduct = {
                id: generateId(await this.getAll()), // Autogenera el ID único
                title,
                description,
                code,
                price: Number(price),
                status: Boolean(status),
                stock: Number(stock),
                category,
                thumbnails: Array.isArray(thumbnails) ? thumbnails : [],
            };

            this.#products.push(newProduct);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

            return newProduct;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async updateOneById(id, data) {
        try {
            const productFound = await this.#findOneById(id);

            const updatedProduct = {
                ...productFound,
                ...data,
                id: productFound.id // Aseguramos que el ID no se modifica
            };

            const index = this.#products.findIndex((item) => item.id === Number(id));

            // Validar que el índice es válido
            if (index === -1) {
                throw new ErrorManager("Producto no encontrado para actualizar", 404);
            }

            this.#products[index] = updatedProduct;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

            return updatedProduct;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async deleteOneById(id) {
        try {
            await this.#findOneById(id);
            this.#products = this.#products.filter((item) => item.id !== Number(id));
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}
