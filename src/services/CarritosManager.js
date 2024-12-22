import fs from 'fs/promises'
import path from 'path'

const carritosFilePath = path.resolve('data', 'carritos.json')

export default class CarritosManager {

constructor(){
  this.carritos = [];
  this.init()
}
async init () {
  try{
      const data = await fs.readFile(carritosFilePath, 'utf-8');
      this.carritos = JSON.parse(data);
      
      
  } catch (error) {
      console.log(error);
      this.carritos = [];
  }
}
async saveToFile(){
  try{ const jsonData = JSON.stringify(this.carritos, null, 2);
   await fs.writeFile(carritosFilePath, jsonData);
   } catch (error){
       console.log(error);
       }}

  async createCart(cart) { 
    try { 
      let id 
      if (!this.carritos) {
        console.error('Carritos is not initialized.');
        return null;  
      }
      this.carritos.length === 0 ? id = 1 : id = this.carritos[this.carritos.length - 1].id + 1 
      
      const newCarrito = {
        id, ...cart 
      }
      this.carritos.push(newCarrito);
      this.saveToFile()
      return newCarrito
    } catch (error) {
      console.log(error);
    }} 
      
    async getProducts(id) { 
      try {
        const carrito = this.carritos.find(carrito => carrito.id === parseInt(id));
        
        return carrito?.products 
        
        
      } catch (error) {
        console.log(error)
      }


    }

    async addProduct(product, id){
      try { 
        const carrito = this.carritos.find(carrito => carrito.id === parseInt(id));
        carrito?.products.push(product)
        this.saveToFile()
        return carrito
       
      } catch (error) {
        console.log(error)
      }
    }


    async removeProduct(cid, id) {
      try {
        const carrito = this.carritos.find(carrito => carrito.id === parseInt(cid));
        
        const newProducts = carrito.products.filter(product => product.id != parseInt(id));
        carrito.products = newProducts
        this.saveToFile()
        return newProducts
        
      } catch (error) {
        console.log(error)
      }}

      async deleteCarrito(cid) {
        try { 
          const newCarritos = this.carritos.filter(carrito => carrito.id != parseInt(cid));
          this.carritos = newCarritos
          this.saveToFile()

        } catch (error) {
          console.log(error)
        }

      }
}

