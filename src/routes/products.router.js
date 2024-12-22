import { Router } from 'express';
import ProductManager from '../services/ProductManager.js';

const router = Router();
const productManager = new ProductManager();


const paginate = (products, page, limit) => {
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
        products: paginatedProducts,
        totalPages,
        startIndex,
        endIndex,
        totalProducts
    };
};

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        let products = await productManager.getAllProducts();

        
        if (query) {
            products = products.filter(product => 
                product.category.toLowerCase().includes(query.toLowerCase()) || 
                product.stock > 0 
            );
        }

        
        if (sort === 'asc') {
            products = products.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            products = products.sort((a, b) => b.price - a.price);
        }

       
        const { products: paginatedProducts, totalPages, startIndex, endIndex, totalProducts } = paginate(products, page, limit);

        
        const prevPage = page > 1 ? parseInt(page) - 1 : null;
        const nextPage = page < totalPages ? parseInt(page) + 1 : null;

        res.json({
            status: 'success',
            payload: paginatedProducts,
            totalPages,
            prevPage,
            nextPage,
            page: parseInt(page),
            hasPrevPage: prevPage !== null,
            hasNextPage: nextPage !== null,
            prevLink: prevPage ? `/api/products?page=${prevPage}&limit=${limit}` : null,
            nextLink: nextPage ? `/api/products?page=${nextPage}&limit=${limit}` : null
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Error en la obtención de productos' });
    }
});

export default router;
