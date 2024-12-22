import fs from 'fs/promises';
import path from 'path';

const productosFilePath = path.resolve('data', 'productos.json')

export default class ProductManager {

    constructor() {
        this.products = [];
        this.init()
    }
    async init () {
        try{
            const data = await fs.readFile(productosFilePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.log(error);
            this.products = [];
        }
    }

    async saveToFile(){
       try{ const jsonData = JSON.stringify(this.products, null, 2);
        await fs.writeFile(productosFilePath, jsonData);
        } catch (error){
            console.log(error);  
        }
    }
     async getAllProducts(limit) {
        if(limit){
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    async getProductById(id){
        try {
        const product = this.products.find(product => product.id === id);

            return product
        } catch (error) {
        console.log(error)
        }
    }

    async addProduct(product) {
        const newProduct = {
            id: this.products.length ? this.products[this.products.length - 1].id + 1 : 1, ...product,
            status: true,
        }
        this.products.push(newProduct);
        this.saveToFile()
        return newProduct
    }

     async updateProduct(id, updatedFields){
        const productIndex = this.products.findIndex(product => product.id === id);
        if(productIndex===-1) return null;
        const updatedProduct={
            ...this.products[productIndex],
            ...updatedFields,
            id:this.products[productIndex].id,
        };
        this.products[productIndex] = updatedProduct
        this.saveToFile()
        return updatedProduct;
    }

    deleteProduct(id){
        const productIndex = this.products.findIndex(product => product.id === id);
        if(productIndex===-1) return null;

        const deletedProduct = this.products.splice(productIndex, 1);
        this.saveToFile()
        return deletedProduct[0];
        
    }





}