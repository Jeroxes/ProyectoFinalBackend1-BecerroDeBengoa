import { json, Router } from 'express';
import ProductManager from '../services/ProductManager.js';

const router = Router();
const productManager = new ProductManager();


router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;  // Obtención de query params
    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);

   
    let products = await productManager.getAllProducts();

    
    if (query) {
      products = products.filter(product => {
        return product.category.toLowerCase().includes(query.toLowerCase()) ||
               (product.stock > 0 && query.toLowerCase() === 'available');
      });
    }

  
    if (sort === 'asc') {
      products = products.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      products = products.sort((a, b) => b.price - a.price);
    }

   
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limitInt);
    const startIdx = (pageInt - 1) * limitInt;
    const endIdx = pageInt * limitInt;
    const paginatedProducts = products.slice(startIdx, endIdx);

  
    const hasPrevPage = pageInt > 1;
    const hasNextPage = pageInt < totalPages;

    const prevPage = hasPrevPage ? pageInt - 1 : null;
    const nextPage = hasNextPage ? pageInt + 1 : null;

    const prevLink = hasPrevPage ? `/api/products?limit=${limitInt}&page=${prevPage}&sort=${sort}&query=${query}` : null;
    const nextLink = hasNextPage ? `/api/products?limit=${limitInt}&page=${nextPage}&sort=${sort}&query=${query}` : null;

    res.json({
      status: 'success',
      payload: paginatedProducts,
      totalPages,
      prevPage,
      nextPage,
      page: pageInt,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: 'Hubo un problema al procesar la solicitud' });
  }
});


router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    const newProduct = await productManager.addProduct({ title, description, code, price, stock, category, thumbnails });
    
    res.status(201).json({ message: 'El producto se creó de forma correcta', product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Hubo un problema al crear el producto' });
  }
});

export default router;
