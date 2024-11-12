import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile, deleteFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";

export default class SkuManager {
    #jsonFilename;
    #skus;

    constructor() {
        this.#jsonFilename = "sku.json";
    }

    async #findOneById(id) {
        this.#skus = await this.getAll();
        const skuFound = this.#skus.find((item) => item.id === Number(id));

        if (!skuFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return skuFound;
    }

    async getAll() {
        try {
            this.#skus = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#skus;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getOneById(id) {
        try {
            const skuFound = await this.#findOneById(id);
            return skuFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async insertOne(data, file) {
        try {
            const { nombre_sku, precio, disponibilidad } = data;

            if (!nombre_sku || !precio || !disponibilidad) {
                throw new ErrorManager("Faltan datos obligatorios", 400);
            }

            const sku = {
                id: generateId(await this.getAll()),
                nombre_sku,
                precio: Number(precio),
                disponibilidad: convertToBoolean(disponibilidad),
                thumbnail: file?.filename,
            };

            this.#skus.push(sku);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#skus);

            return sku;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename);
            throw new ErrorManager(error.message, error.code);
        }
    }

    async updateOneById(id, data, file) {
        try {
            const { nombre_sku, precio, disponibilidad } = data;
            const skuFound = await this.#findOneById(id);

            const sku = {
                id: skuFound.id,
                nombre_sku: nombre_sku || skuFound.nombre_sku,
                precio: precio ? Number(precio) : skuFound.precio,
                disponibilidad: disponibilidad ? convertToBoolean(disponibilidad) : skuFound.disponibilidad,
                thumbnail: file?.filename || skuFound.thumbnail,
            };

            const index = this.#skus.findIndex((item) => item.id === Number(id));
            this.#skus[index] = sku;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#skus);

            if (file?.filename && sku.thumbnail !== skuFound.thumbnail) {
                await deleteFile(paths.images, skuFound.thumbnail);
            }

            return sku;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename);
            throw new ErrorManager(error.message, error.code);
        }
    }

    async deleteOneById(id) {
        try {
            const skuFound = await this.#findOneById(id);

            if (skuFound.thumbnail) {
                await deleteFile(paths.images, skuFound.thumbnail);
            }

            const index = this.#skus.findIndex((item) => item.id === Number(id));
            this.#skus.splice(index, 1);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#skus);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}
