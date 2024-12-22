import { Router } from 'express';
import CarritosManager from '../services/CarritosManager.js'
import ProductManager from '../services/ProductManager.js';

const carritosManager = new CarritosManager()

const productManager = new ProductManager()

const router = Router();

router.post('/', async (req, res) => {
  const timeStamp = Date.now()
  const cart = {
    'products' : [],
     'timeStamp' : timeStamp
  }
  
  const newCart = await carritosManager.createCart(cart);
  res.status(201).json({ message: 'Carrito creado', cartId: newCart.id });
});


router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const products = await carritosManager.getProducts(parseInt(cid));
  
 res.status(200).json(products);
});


router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const product = await productManager.getProductById(parseInt(pid));
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  const addedProduct = await carritosManager.addProduct(product, parseInt(cid));
  res.status(200).json({ message: 'Producto agregado al carrito', addedProduct });
});


router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const updatedCart = await carritosManager.removeProduct(cid, pid);
  if (updatedCart) {
      res.status(200).json({ message: 'Producto eliminado del carrito', updatedCart });
  } else {
      res.status(404).json({ message: 'Carrito o producto no encontrado' });
  }
});

router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;  
  const updatedCart = await carritosManager.updateCart(cid, products);
  res.status(200).json({ message: 'Carrito actualizado', updatedCart });
});

router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const updatedProduct = await carritosManager.updateProductQuantity(cid, pid, quantity);
  if (updatedProduct) {
      res.status(200).json({ message: 'Cantidad de producto actualizada', updatedProduct });
  } else {
      res.status(404).json({ message: 'Carrito o producto no encontrado' });
  }
});

router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  await carritosManager.deleteCarrito(cid);
  res.status(200).json({ message: 'Carrito eliminado' });
});




export default router;
