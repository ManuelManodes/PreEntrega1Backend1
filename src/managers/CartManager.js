import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import ErrorManager from "./ErrorManager.js";

export default class CartManager {
    #jsonFilename;
    #carts;

    constructor() {
        this.#jsonFilename = "carts.json"; // Archivo donde se almacenan los carritos
    }

    async #findOneById(id) {
        this.#carts = await this.getAll();
        console.log("Carritos disponibles:", this.#carts);
        console.log("Buscando carrito con ID:", id);
    
        const cartFound = this.#carts.find((item) => item.id === Number(id)); // Asegura que sea numérico
        if (!cartFound) {
            throw new ErrorManager("Carrito no encontrado", 404);
        }
    
        return cartFound;
    }
    

    async getAll() {
        try {
            this.#carts = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#carts;
        } catch (error) {
            throw new ErrorManager("Error al obtener los carritos", 500);
        }
    }

    async getCartById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async createCart() {
        try {
            const newCart = {
                id: generateId(await this.getAll()), // Autogenera un ID único
                products: [],
            };

            this.#carts.push(newCart);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

            return newCart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cartFound = await this.#findOneById(cartId);
            const productIndex = cartFound.products.findIndex((item) => item.product === productId);

            if (productIndex >= 0) {
                cartFound.products[productIndex].quantity += 1; // Incrementa la cantidad
            } else {
                cartFound.products.push({ product: productId, quantity: 1 }); // Agrega el producto
            }

            const index = this.#carts.findIndex((item) => item.id === cartId);
            this.#carts[index] = cartFound;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}
